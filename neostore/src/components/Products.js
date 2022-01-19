import React, { useState, useEffect } from 'react'
import { getProducts, allCategories, allColors, getColorsProducts, getCategoriesProducts, cartAdd } from '../Config/Myservice';
import { useNavigate } from 'react-router'
import { Container, Card, Button, Row, Col, Dropdown, DropdownButton, Accordion } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactStars from 'react-rating-stars-component';
import ReactPaginate from 'react-paginate';
function Products() {
    let email = sessionStorage.getItem('user')
    const [products, setProducts] = useState([]);
    const [pagenumber, setPagenumber] = useState(0);
    const productsPerPage = 6;
    const pageVisited = pagenumber * productsPerPage
    const pageCount = Math.ceil(products.length / productsPerPage)
    const [filter, setFilter] = useState('')
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [rating, setRating] = useState('')
    const [state, setState] = useState('')
    const [sortStatus, setSortStatus] = useState(true);
    const navigate = useNavigate();
    //For getting All products, By Category and By Color
    useEffect(() => {
        getProducts()
            .then(res => {
                console.log(res.data.products)
                setProducts(res.data.products)
            })

        allCategories()
            .then(res => {
                console.log(res.data)
                setCategories(res.data.category)
            })
        allColors()
            .then(res => {
                console.log(res.data)
                setColors(res.data.colors)
            })
    }, [])
    //For Category List
    const selectCategory = (id) => {
        getCategoriesProducts(id)
            .then(res => {
                setProducts(res.data.products);
                console.log(res.data.products)
            })
    }
    //For Color List
    const selectColor = (id) => {
        getColorsProducts(id)
            .then(res => {
                setProducts(res.data.products)
                console.log(res.data.products)
            })
    }
    //For All Products
    const getAllData = () => {
        getProducts()
            .then(res => {
                console.log(res.data)
                setProducts(res.data.products);
            })
    }
    //For Details of Single Product
    const singleitem = (id) => {
        console.log(id);
        navigate('/productdetails', { state: { id: id } })
    }
    //For Adding To Cart
    const addCart = (item, id) => {
        if (localStorage.getItem('mycart') != undefined) {
            let arr = JSON.parse(localStorage.getItem('mycart'));
            console.log(arr);
            if (arr.find(x => x.id == id) != undefined) {
                let ind = arr.findIndex(x => x.id === id);
                arr[ind] = { id: id, quantity: arr[ind].quantity + 1, item: item, email: email };
                localStorage.setItem('mycart', JSON.stringify(arr));
                alert("Product quantity is increased");
            } else {
                arr.push({ id: id, quantity: 1, item: item, email: email });
                localStorage.setItem('mycart', JSON.stringify(arr));
                // counter()
                alert("Product Added to Cart")
                window.location.reload(false);
            }
        } else {
            let arr = [];
            arr.push({ id: id, quantity: 1, item: item, email: email });
            localStorage.setItem('mycart', JSON.stringify(arr));
            alert("Product Added to Cart")
            window.location.reload(false);
        }
    }
    //For Sorting By Low to High Price
    const sortByAsc = (e) => {
        e.preventDefault();
        const data = products;
        if (sortStatus) {
            let sorted = data.sort((a, b) =>
                a.productCost - b.productCost)
            setProducts(sorted)
            setSortStatus(!sortStatus)
        } else {
            setProducts(products);
            setSortStatus(!sortStatus);
        }
    }
    //For Sorting By High to Low Price
    const sortByDsc = (e) => {
        e.preventDefault();
        const data = products;
        if (sortStatus) {
            let sorted = data.sort((a, b) =>
                b.productCost - a.productCost)
            setProducts(sorted)
            setSortStatus(!sortStatus)
        } else {
            setProducts(products);
            setSortStatus(!sortStatus);
        }
    }
    //For Sorting By Rating 
    const ratingChanged = (e) => {
        e.preventDefault();
        const data = products;
        if (sortStatus) {
            let sorted = data.sort((a, b) =>
                b.productRating - a.productRating)
            setProducts(sorted)
            setSortStatus(!sortStatus)
        } else {
            setProducts(products);
            setSortStatus(!sortStatus);
        }
    }
    //For Searching Products
    const searchProducts = (event) => {
        setFilter(event.target.value)
    }
    let dataSearch = products.filter(item => {
        return Object.keys(item).some(key =>
            item[key].toString().toLowerCase().includes(filter.toString().toLowerCase())
        )
    });
    //For Showing Products In Pagination
    const displayProducts = dataSearch.slice(pageVisited, pageVisited + productsPerPage).map((item) =>
        <Col lg={4} key={item._id}>
            <Card className='m-3 p-3'>
                <Card.Img variant='top' src={item.productImage} onClick={() => singleitem(item._id)} width={300} height={200} />
                <Card.Body>
                    <Card.Title>{item.productProducer}</Card.Title>
                    <Card.Text><b>₹{item.productCost}</b></Card.Text>
                    <div class="col-md-12 text-center">
                        <Button variant='danger' onClick={() => { addCart(item, item._id) }}>Add To Cart</Button>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <ReactStars
                            count={5}
                            onChange={(e) => { setRating(e.target.value) }}
                            size={18}
                            activeColor="#ffd700"
                            className="card1"
                            edit={true}
                            isHalf={true}
                            value={item.productRating}
                        />
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )
    //For Changing Page
    const changePage = ({ selected }) => {
        setPagenumber(selected)
    };
    return (
        <div>
            <Header cart={state} />
            <Row className='m-3'>
                <Col lg={2} >
                    <Dropdown.Item className="shadow p-3 mb-4 bg-white rounded" variant="outline-secondary" size="lg" onClick={getAllData}> All Products</Dropdown.Item>
                    <DropdownButton variant="light" title="Categories" className="shadow p-3 mb-4 bg-white rounded" size="lg">
                        {categories.map(catitem =>
                            <Dropdown.Item key={catitem._id} onClick={() => selectCategory(catitem._id)}>{catitem.category_name}</Dropdown.Item>
                        )}
                    </DropdownButton>

                    <DropdownButton variant="light" title="Colors" className="shadow p-3 mb-4 bg-white rounded" id="input-group-dropdown-1" size="lg">
                        {colors.map(coloritem =>
                            <Dropdown.Item key={coloritem._id} onClick={() => selectColor(coloritem._id)}>{coloritem.color_name}</Dropdown.Item>
                        )}
                    </DropdownButton>
                </Col>
                <Col className='md-8 ' >
                    <div style={{ float: 'right' }}>
                        <span className='fs-4'><b>Sort By : </b></span> &nbsp;&nbsp;
                        <Button variant="light" onClick={ratingChanged}>Rating</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant='light' onClick={sortByDsc}>High Price</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant='light' onClick={sortByAsc}>Low Price</Button>&nbsp;&nbsp;
                    </div><br /><br />
                    <div className='="container pt-3'>
                        <input type='text' className='form-control' placeholder='Search Products Here' value={filter} onChange={searchProducts.bind(this)} />
                    </div>
                    <Container className='mt-3 bg-light border border-dark'>
                        <Row><br /><br />
                            {displayProducts}
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                pageCount={pageCount}
                                onPageChange={changePage}
                                containerClassName={"paginationBttns"}
                                previousLinkClassName={"previousBttn"}
                                nextLinkClassName={"nextBttn"}
                                disbaledClassName={"paginationDisabled"}
                                activeClassName={"paginationActive"}
                            />
                        </Row>
                    </Container>
                </Col>
            </Row>
            <Footer />
        </div>
    )
}
export default Products