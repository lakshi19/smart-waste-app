import React from "react";
import { Form, Input, Button, Select, Card } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const ReportForm = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Card
      title="Report Waste Issue"
      bordered={true}
      style={{
        maxWidth: 500,
        margin: "20px auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: 10,
      }}
    >
      <h3>*Please click on map before proceed</h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        {/* Name */}
        <Form.Item
          label="Your Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        {/* Issue Type */}
        <Form.Item
          label="Issue Type"
          name="issueType"
          rules={[{ required: true, message: "Please select issue type!" }]}
        >
          <Select placeholder="Select issue type">
            <Option value="Garbage">Garbage</Option>
            <Option value="Litter">Litter</Option>
            <Option value="Overflowing Bin">Overflowing Bin</Option>
            <Option value="Illegal Dumping">Illegal Dumping</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Address"
          name="location"
          rules={[
            { required: true, message: "Please give the address!" },
            {
              min: 10,
              message: "Please provide location of issue",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Briefly describe the problem..."
            showCount
            maxLength={300}
          />
        </Form.Item>
        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please describe the issue!" },
            {
              min: 10,
              message: "Description should be at least 10 characters",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Briefly describe the problem..."
            showCount
            maxLength={300}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              backgroundColor: "#1677ff",
              borderRadius: 6,
              height: "40px",
              fontWeight: 500,
            }}
          >
            Submit Report
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReportForm;
