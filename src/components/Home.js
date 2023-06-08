import React, {useState, } from 'react'
import { Button,  Spin, Row, Col } from 'antd';
import { APP_DESC} from '../constants';
import { useNavigate } from 'react-router';
import { CheckCircleTwoTone } from '@ant-design/icons';
import logo from '../assets/logo_trans.png';

const CHECKLIST_ITEMS = [
  'Good organic data',
  'Users own their data',
  'An Intuitive Interface',
];


export const Home = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState()

    return  <div className='home-section'>
      <Row className='home-section'>
        <Col span={12}>
        <div className='prompt-section'>
        <h1>TANTRIKA</h1>
          {APP_DESC}
         
      </div>
      <div>
    
      </div>
      <div>
          <Button className='standard-btn' size="large" type="primary" onClick={() => navigate('/upload')}>
            Get Started
          </Button>
      </div>
        </Col>
        <Col span={12}>
          <img className='hero-image' src={logo}/>
        </Col>
      </Row>
           
    </div>

}