import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './StockInventoryTable.css';

const StockInventoryTable = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    // Fetch all inventory items
    const fetchItems = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            console.log('User info:', userInfo); // Debug log

            if (!userInfo || !userInfo.token) {
                throw new Error('No auth token found');
            }

            const response = await axios.get('http://localhost:5000/api/inventory/all', {
                headers: { 
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                }
            });
            setItems(response.data);
        } catch (error) {
            message.error('Failed to fetch inventory items');
            console.error('Fetch error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            if (!userInfo || !userInfo.token) {
                throw new Error('No auth token found');
            }

            if (editingItem) {
                await axios.put(`http://localhost:5000/api/inventory/${editingItem._id}`, values, {
                    headers: { 
                        'Authorization': `Bearer ${userInfo.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                message.success('Item updated successfully');
            } else {
                await axios.post('http://localhost:5000/api/inventory', values, {
                    headers: { 
                        'Authorization': `Bearer ${userInfo.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                message.success('Item added successfully');
            }
            setModalVisible(false);
            form.resetFields();
            fetchItems();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
            console.error('Submit error:', error);
        }
    };

    // Handle item deletion
    const handleDelete = async (id) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            await axios.delete(`http://localhost:5000/api/inventory/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            message.success('Item deleted successfully');
            fetchItems();
        } catch (error) {
            message.error('Failed to delete item');
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Price (₹)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `₹${price.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="action-buttons">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingItem(record);
                            form.setFieldsValue(record);
                            setModalVisible(true);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="stock-inventory-table">
            <div className="table-header">
                <h2>Inventory Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingItem(null);
                        form.resetFields();
                        setModalVisible(true);
                    }}
                >
                    Add New Item
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={items}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingItem ? 'Edit Item' : 'Add New Item'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter item name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please enter price' }]}
                    >
                        <InputNumber
                            min={0}
                            prefix="₹"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true, message: 'Please enter quantity' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {editingItem ? 'Update' : 'Add'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StockInventoryTable; 