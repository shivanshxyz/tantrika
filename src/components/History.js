import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Input, Select, Table } from "antd";
import { APP_NAME, CHAIN_OPTIONS, ACTIVE_CHAIN } from "../constants";
import { getTransactions } from "../util/history";
import { capitalize, col, formatDate, getExplorerUrl } from "../util";
import logo from '../assets/logo_trans.png'

const { Option } = Select;

const COLUMNS = [
  //   col("tx_hash"),
  //   col("from_address"),
  col("type", r => 'Purchase'),
  col("from", r => r.robust),
  col("value"),
  col("to",r => r.robust),
];

function History(props) {
  const [address, setAddress] = useState(
    "0x446Df52b0BeA07443c8Bd890089a231485885cfC"
  );
  const [chainId, setChainId] = useState(ACTIVE_CHAIN.id);
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  const fetchHistory = async () => {
    if (!address || !chainId) {
      alert("Address and chainId are required");
      return;
    }

    setLoading(true);
    try {
      const res = await getTransactions(chainId, address);
      const messages = res.data.data.messages
      if (!messages) {
        alert('No transactions found!')
      }
      setData(messages);
    } catch (e) {
      console.error(e);
      alert("error getting signdata" + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <img src={logo} className='history-logo' />
      <p>
        This page can be used to lookup {APP_NAME} transactions against a given datamarket identifier
      </p>
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        prefix="DataMarket Contract:"
      ></Input>
      <br />
      <p></p>
      <Select
        defaultValue={ACTIVE_CHAIN.name}
        style={{ width: 180 }}
        onChange={(v) => setChainId(v)}
      >
        {Object.keys(CHAIN_OPTIONS).map((cId, i) => {
          return (
            <Option key={i} value={cId}>
              {capitalize(CHAIN_OPTIONS[cId].name)}
            </Option>
          );
        })}
      </Select>
      &nbsp;
      <Button type="primary" onClick={fetchHistory} disabled={loading} loading={loading}>
        Lookup history
      </Button>
      <br />
      <hr />
      {data && (
        <div>
          <h1>Message History</h1>
          <Table
            dataSource={data}
            columns={COLUMNS}
            className="pointer"
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  console.log("event", event.target.value);
                  window.open(
                    getExplorerUrl(record.cid, true),
                    "_blank"
                  );
                }, // click row
                onDoubleClick: (event) => {}, // double click row
                onContextMenu: (event) => {}, // right button click row
                onMouseEnter: (event) => {}, // mouse enter row
                onMouseLeave: (event) => {}, // mouse leave row
              };
            }}
          />
          ;
        </div>
      )}
    </div>
  );
}

History.propTypes = {};

export default History;
