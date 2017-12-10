import React, { Component } from 'react';
import { Input } from 'antd';

export default class Register extends Component {

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <Input style={{width: 200}} size="large" placeholder="邮箱" />
      </div>
      
    );
  }
}
