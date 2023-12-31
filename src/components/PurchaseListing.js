import { Web3Button } from '@web3modal/react'
import {useSigner} from 'wagmi'
import { Button, Card, Modal, Result, Spin } from 'antd'
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router'
import { getExampleResponse } from '../constants'
import { flagDataset, getMetadata, purchaseDataset } from '../contract/dataContract'
import { getExplorerUrl, ipfsUrl } from '../util'
import TextArea from 'antd/lib/input/TextArea'

export default function PurchaseListing({network, account}) {
  const { data: signer, error: signerError, isLoading, refetch } = useSigner()

  const [error, setError] = useState()
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(false)
  const [dataset, setDataset] = useState()
  const [reason, setReason] = useState()
  const [flagModal, setFlagModal] = useState(false)

  const params = useParams()
  const {contractAddress} = params

  async function flag() {
    setError('')
    setLoading(true)
    try {
      const res = await flagDataset(signer, contractAddress, reason)
      // const res = await flagDataset(signer, contractAddress, "tst")
      console.log('res', res)
      setResult({...res, dataUrl: dataset?.dataUrl})
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setFlagModal(false)
    }
  }

   async function purchase() {
    // TODO: add error check for preset location if user denied permission or location not retrievable.
    setLoading(true)
    setError('')
    const {priceEVM} = dataset
    try {
      const res = await purchaseDataset(signer, contractAddress, priceEVM)
      // const res = await flagDataset(signer, contractAddress, "tst")
      console.log('res', res)
      setResult({...res, dataUrl: dataset?.dataUrl})
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  } 

  async function getDatasetInfo() {
    setError(undefined)
    setLoading(true)
    try {
      const res = await getMetadata(signer, contractAddress);
      setDataset(res?.data || {})
    } catch (e) {
      console.error('error fetching record', e)
      let { message } = e
      // setError(humanError(message))
      setDataset(getExampleResponse())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (signer) {
      getDatasetInfo()
    }
  }, [contractAddress, signer])

  if (loading) {
    return <Spin size="large" className='boxed'/>
  }

  const isReady = !loading && dataset?.priceEVM

  if (error && !isReady) {
    return <div className='error-text boxed'>
      {error}
    </div>
  }


  return (
    <div className='boxed purchase-page'>
      <Card title={        <span className='centered success-text'>Buy Dataset</span>}>

      {dataset && <div className='centered card boxed'>
        <h2>{dataset.title}</h2>
        <p>{dataset.description}</p>
        {dataset.createdAt && <p>Listed at: {dataset.createdAt}</p>}
        {/* {!isNaN(dataset.purchases) && <p>Purchases: {dataset.purchases}</p>} */}
        {dataset.priceEVM && <p>Price: {dataset.priceEVM} TFIL</p>}

        <p>Keywords: {dataset.keywords}</p>
        <br/>


      {isReady && !result && <Button type="primary" size="large" loading={loading} onClick={purchase}>
        Purchase dataset
      </Button>}
      <br/>

      <p><a href="#" onClick={(e) => {
        e.preventDefault()
        setFlagModal(true)
      }}>Flag Dataset</a></p>

      {!isReady && <div><Web3Button/></div>}
      <br/>
      {error && <p className='error-text'>{error}</p>}
      {result && <Result status="success" title="Dataset purchased!"
      subTitle={"Use the link below to access your data"}
        extra={[
      <Button type="primary" key="console" onClick={() => {
        window.open(ipfsUrl(result.dataUrl), "_blank")
      }}>
        Access dataset contents
      </Button>,
      <Button type="secondary" key="console" onClick={() => {
        window.open(getExplorerUrl(result.hash, true), "_blank")
      }}>
        View transaction
      </Button>,
    ]}/>}

      </div>}

      </Card>

      <Modal title={`Flag listing`} open={flagModal} onOk={flag} onCancel={() => setFlagModal(false)}>
        {dataset?.title && <p><b>Listing: {dataset.title}</b></p>}
        <p>Flag this dataset if you know or believe the contents to be invalid.</p>
        <p>Your account address will be recorded.</p>
        <h5>Reason</h5>
        <TextArea
              aria-label="Flag Reason"
              onChange={(e) => setReason(e.target.value)}
              placeholder="Your reason for flagging this listing"
              value={reason}
            />
      </Modal>

    </div>
  )
}