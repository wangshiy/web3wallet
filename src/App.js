import React from "react";
import { Form, Input, InputNumber, Button, Typography } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import './App.css';

const FormItem = Form.Item;

function App() {
  const [form] = Form.useForm();

  const onSubmit = () => {
    form.validate(async (errors, values) => {
      if (!errors) {
        console.log('values', values);
      }
    });
  }

  return (
    <div className="App">
      <Typography.Title>Transfer Your Token Here</Typography.Title>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Form style={{ width: 600 }} form={form} onSubmit={onSubmit}>
          <FormItem label='Address' field='address' rules={[{ required: true, message: 'Please enter' }]}>
            <Input placeholder='Recipient Address...' />
          </FormItem>
          <FormItem
            label='Amount'
            field='amount'
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <InputNumber placeholder='Make sure you have IYO token...' />
          </FormItem>
          <FormItem>
            <Button type='primary' htmlType='submit'>Submit</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}

export default App;
