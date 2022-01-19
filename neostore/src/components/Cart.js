import React, { useEffect, useState } from 'react';
import { Button, Container, Table, Form, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { MdDelete } from 'react-icons/md';
import { createOrders } from '../Config/Myservice'
import Header from './Header';
import Footer from './Footer';
function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    let items = [];
    let total = [0];
    useEffect(() => {
        //Getting Cart details from localStorage
        let cartItems = JSON.parse(localStorage.getItem("mycart"));
        setCart(cartItems);
    }, [])
    console.log(cart);
    //On Adding in Cart increases in localstorage also 
    const onAdd = (index) => {
        console.log(cart[index])
        let temp = [...cart]
        temp[index].quantity++
        setCart(temp)
        localStorage.setItem("mycart", JSON.stringify(temp))
    };
    //On Decreasing in Cart decreases in localstorage also
    const onRemove = (index) => {
        console.log(cart[index]);
        let temp = [...cart]
        temp[index].quantity--
        setCart(temp)
        localStorage.setItem('mycart', JSON.stringify(temp));
    }
    //On Removing in Cart Deleting in localstorage also
    const onDelete = (index) => {
        let lstore = JSON.parse(localStorage.getItem('mycart'))
        lstore.splice(index, 1);
        console.log(lstore);
        let setStore = JSON.stringify(lstore);
        localStorage.setItem('mycart', setStore);
        setCart(lstore)
    }
    //For Proceed to Buy Storing all the data and posting it in backend
    const proceedBuy = () => {
        console.log(cart);
        cart.map((value) => {
            let allorders = { productName: `${value.item.productName}`, productCost: `${value.item.productCost}`, productImage: `${value.item.productImage}`, quantity: `${value.quantity}` }
            items.push(allorders)
            console.log(items.productName);
        })
        let email = sessionStorage.getItem('user')
        let orderno = Math.random().toFixed(6).split('.')[1];
        let checkout = {
            email: email,
            items: items,
            orderno :orderno,
            total: total.reduce((result, number) => result + number) + 0.05 * (total.reduce((result, number) => result + number))
        }
        console.log(checkout);
        createOrders(checkout)
            .then((res) => {
                console.log(res.data);
                navigate("/checkout",{state :{orderno :orderno}});
            })
    }
    return (
        <>
            <Header />
            <Container fluid>
                <Row>
                    <Col lg={8}><br />
                        {cart.length !== 0 ?
                            <Card>
                                <h2>My Orders</h2><br />
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart ? cart.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td><b><img src={value.item.productImage} width='100px' height='80px' /></b></td>
                                                    <td><b>{value.item.productName}</b></td>
                                                    <td><b>{value.item.productCost}</b></td>
                                                    <td>
                                                        <Row>
                                                            <Col>
                                                                <Button variant='primary' onClick={() => onRemove(index)}>-</Button>
                                                            </Col>
                                                            <Col>
                                                                <Form.Control type='text' min='1' max='10' value={value.quantity} />
                                                            </Col>
                                                            <Col>
                                                                <Button variant='primary' onClick={() => onAdd(index)}>+</Button>
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                    <td><b>{value.quantity * value.item.productCost}</b></td>
                                                    <td><Button variant='danger' onClick={() => onDelete(index)}><MdDelete /></Button></td>
                                                    {console.log(total.push(
                                                        value.item.productCost * value.quantity
                                                    ))
                                                    }
                                                </tr>
                                            )
                                        }) : ""}
                                    </tbody>
                                </Table>
                            </Card>
                            :
                            <h3>Your Cart is Empty</h3>}
                    </Col>
                    <Col><br />
                        <Card>
                            <h3>Review Order </h3>
                            <hr />
                            <h5> <span style={{ float: 'left' }}> &nbsp;&nbsp;SubTotal</span><span style={{ float: 'right' }}>{total.reduce((result, number) => result + number)}&nbsp;&nbsp;</span></h5>
                            <hr />
                            <h5><span style={{ float: 'left' }}> &nbsp;&nbsp;GST% </span><span style={{ float: 'right' }}>{0.05 * (total.reduce((result, number) => result + number))}&nbsp;&nbsp;</span></h5>
                            <hr />
                            <h5><span style={{ float: 'left' }}> &nbsp;&nbsp;Total </span><span style={{ float: 'right' }}>{total.reduce((result, number) => result + number) + 0.05 * (total.reduce((result, number) => result + number))}&nbsp;&nbsp;</span></h5>
                            <hr />
                            <Button variant='primary' onClick={() => proceedBuy()}>Proceed to Buy</Button><br />
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    )
}
export default Cart