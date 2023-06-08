import React, { useEffect, useState } from "react";
import { Button, Input, Row, Col, Steps, Result } from "antd";
import { TantrikaUrl, ipfsUrl, getExplorerUrl, humanError, } from "../util";
import { ACTIVE_CHAIN, APP_NAME, EXAMPLE_FORM, updateForm } from "../constants";
import { FileDrop } from "./FileDrop/FileDrop";
import { uploadFiles } from "../util/stor";
import { deployContract } from "../contract/dataContract";
import { useSigner } from "wagmi";
import TextArea from "antd/lib/input/TextArea";

const { Step } = Steps;

function UploadListing({network, account}) {
  const { data: signer, error: signerError, isLoading: signerLoading, refetch } = useSigner()

  useEffect(() => {
    const networkId = network?.chain?.id
    console.log('network', network)
    if (networkId) {
      refetch()
    }
  }, [network, account])

  const [data, setData] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const setDemo = () => setData({...EXAMPLE_FORM})

  const updateData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const getActiveError = (data) => {
    if (!data.title || !data.description || !data.priceEVM) {
      return "Please provide a name, description, price for the item.";
    }

    if (!data.files || (data.files || []).length === 0) {
      return "Must add at least one file";
    }

    return undefined
  };

  const errMessage = getActiveError(data);

  const create = async () => {
    setError(undefined);

    if (errMessage) {
      setError(errMessage)
      return;
    }

    if (!signer) {
      setError(`Please connect a valid ${ACTIVE_CHAIN.name} wallet`);
      return;
    }

    setLoading(true);
    const body = { ...data };

    // Format files for upload.
    const files = (body.files || []).map((x) => {
      return x;
    });

    let res = { ...data };

    try {
      // 2) Upload files/metadata to ipfs.
      let cid = '';
      if (files && files.length > 0) {
        cid = await uploadFiles(
          files,
          res
        );
      }

      // 3) return shareable url.
      const contract = await deployContract(signer, data.title, data.description, cid, data.priceEVM, data.keywords)
      // 1) deploy base contract with metadata,

      res["TantrikaUrl"] = TantrikaUrl(contract.address);
      res["dataUrl"] = cid
      res["contract"] = contract.address;
      res["contractUrl"] = getExplorerUrl(contract.address);

      // Result rendered after successful doc upload + contract creation.
      setResult(res);
      updateForm(res)
    } catch (e) {
      console.error("error creating Tantrika request", e);
      const message = e.reason || e.response?.message || e.message
      setError(humanError(message))
    } finally {
      setLoading(false)
    }
  };

  const getStep = () => {
    if (!!result) {
      return 2;
    } else if (!errMessage) {
      return 1;
    }
    return 0;
  };

  return (
    <div>
          <div className="create-form boxed">
            {!result && <><h1>Register</h1>

            <h5>Dataset name</h5>
            <Input
              value={data.title}
              onChange={(e) => updateData("title", e.target.value)}
            />
            <br/>
            <br/>

            <h5>Describe your dataset</h5>
            <TextArea
              aria-label="Description"
              onChange={(e) => updateData("description", e.target.value)}
              prefix="Description"
              value={data.description}
            />
            <br/>
            <br/>

            <h5>Asking Price ({ACTIVE_CHAIN.symbol})</h5>
            <Input
              value={data.priceEVM}
              onChange={(e) => updateData("priceEVM", e.target.value)}
            />
            <br/>
            <br/>

            <h5>Tags</h5>
            <Input
              value={data.keywords}
              onChange={(e) => updateData("keywords", e.target.value)}
            />


            {/* TODO: add configurable amount of items */}
            <h3 className="vertical-margin">Upload dataset</h3>
            <FileDrop
              files={data.files || []}
              setFiles={(files) => updateData("files", files)}
            />

            <Button
              type="primary"
              className="standard-button"
              onClick={create}
              disabled={loading || errMessage}
              loading={loading}
              size="large"
            >
              UPLOAD
            </Button>
            {!error && !result && loading && (
              <span>&nbsp;Note this may take a few moments.</span>
            )}
            <br />
            <br />
            </>}
            {error && <div className="error-text">Error: {error}</div>}
            {result && (<div>
              <Result status="success"
 title="Created tantrika request!" subTitle="Access your page and content below"/>
              <div>
                <a href={ipfsUrl(result.dataUrl)} target="_blank">
                  View files
                </a>
                <br />
                <a href={result.contractUrl} target="_blank">
                  View created contract
                </a>
                <br />
                <br />
                <p>
                  Share or post this page with potential customers
                  <br />
                  <a href={result.TantrikaUrl} target="_blank">
                    View listing page
                  </a>
                </p>
              </div>
              </div>
            )}
          </div>
    </div>
  );
}

UploadListing.propTypes = {};

export default UploadListing;
