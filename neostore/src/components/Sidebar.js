import React, { useState, useEffect } from 'react'
import { Sidebardata } from './Sidebardata'
import { getProfile, uploadImage } from '../Config/Myservice';
import { Form, Button } from 'react-bootstrap'
import { REACT_APP_IMAGE_PATH } from '../Config/Url';
function Sidebar() {
    let [user, setUser] = useState([]);
    let [imagePath, setPath] = useState('');
    let [myFile, setMyfile] = useState('')
    //For Getting Profile and Setting Profile Image
    useEffect(() => {
        getProfile(sessionStorage.getItem('user'))
            .then(res => {
                if (res.data.user) {
                    let data = res.data.user;
                    console.log(data);
                    setUser(data);
                    setPath(REACT_APP_IMAGE_PATH + data.myFile)
                }
            })
    }, [])
    //For Uploading Profile Image
    const upload = (id, e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('myFile', myFile)
        console.log(formdata);
        uploadImage(id, formdata)
            .then((res, err) => {
                if (res.data.err) {
                    alert(res.data.err)
                }
                else {
                    alert(res.data.msg)
                    window.location.reload();
                }
            });
    }
    return (
        <div className='sidebar'>
            <h4>My Account</h4>
            <img src={imagePath} alt='profile' width={240} height={200} style={{ borderRadius: '100%' }} />
            <Form encType='multipart/form-data'>
                <Form.Group className="mb-3"  >
                    <Form.Control type="file" label="Upload Profile" id='files' name="myFile" onChange={(e) => { setMyfile(e.target.files[0]) }} />
                </Form.Group>
                <Button type='submit' onClick={(e) => upload(user._id, e)}>Upload</Button>
            </Form>
            <ul className='SidebarList'>
                {Sidebardata.map((val, key) => {
                    return (
                        <li className='row1' key={key} id={window.location.pathname == val.link ? "active" : ""} onClick={() => { window.location.pathname = val.link }}>
                            <div id='icon1'>{val.icon}{''}
                                <div id='title1'>{val.title}</div></div></li>
                    )
                })}
            </ul>
        </div>
    )
}
export default Sidebar