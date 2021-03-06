import React,{useCallback, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import ImageArea from '../componets/Products/ImageArea';
import { PrimaryButton, SelectBox, TextInput } from '../componets/UIkit';
import { saveProduct} from '../reducks/products/operations';
import {db} from "../firebase/index";
import SetSizeArea from '../componets/Products/SetSizeArea';

const ProductEdit = () => {
    const dispatch = useDispatch();
    let id = window.location.pathname.split('product/edit')[1];
    //console.log("Before split /", id);

    if (id !== "") {
        id = id.split('/')[1]
        //console.log("After split /", id);
    }

    const [name,setName] = useState(""),
          [description, setDescription] = useState(""),
          [category, setCategory] = useState(""),
          [categories, setCategories] = useState([]),
          [images, setImages] = useState([]),
          [gender, setGender] = useState(""),
          [genders, setGenders] = useState([]),
          [price, setPrice] = useState(""),
          [sizes, setSizes] = useState([]);

    const inputName = useCallback((event)=> {
        setName(event.target.value)
    },[setName]);

    const inputDescription = useCallback((event)=> {
        setDescription(event.target.value)
    },[setDescription]);
    
    const inputPrice = useCallback((event)=> {
        setPrice(event.target.value)
    },[setPrice]);

    useEffect(() => {
        if (id !== "") {
            db.collection('products').doc(id).get().then(snapshot =>{
                const data = snapshot.data();
                console.log(data)
                setImages(data.images);
                setName(data.name);
                setDescription(data.description);
                setCategory(data.category);
                setGender(data.gender);
                setPrice(data.price);
                setSizes(data.sizes);
            })
        }
    }, [id])

    useEffect(() => {
        db.collection('categories')
            .orderBy('order','asc')
            .get()
            .then(snapshots => {
                const list = [];
                snapshots.forEach(snapshot => {
                    const data = snapshot.data();
                    list.push({
                        id: data.id,
                        name: data.name
                    })
                })
                setCategories(list);
            });

        db.collection('genders')
        .orderBy('order','asc')
        .get()
        .then(snapshots => {
            const list = [];
            snapshots.forEach(snapshot => {
                const data = snapshot.data();
                list.push({
                    id: data.id,
                    name: data.name
                })
            })
            setGenders(list);
        });
           
    },[])

    return (
        <section>
            <h2 className="u-text__headline u-text-center">????????????????????????</h2>
            <div className = "c-section-container">
                <ImageArea images={images} setImages={setImages}/>
                <TextInput 
                    fullWidth={true} label={"?????????"} multiline={false} required={true}
                    onChange={inputName} rows={1} value={name} type={"text"}
                />
                <TextInput 
                    fullWidth={true} label={"????????????"} multiline={true} required={true}
                    onChange={inputDescription} rows={5} value={description} type={"text"}
                />
                <SelectBox 
                    label={"???????????????"} required={true} options={categories} select={setCategory} value={category}
                />
                <SelectBox 
                    label={"??????"} required={true} options={genders} select={setGender} value={gender}
                />
                <TextInput 
                    fullWidth={true} label={"??????"} multiline={false} required={true}
                    onChange={inputPrice} rows={1} value={price} type={"number"}
                />
                <div className="module-spacer--small" />
                <SetSizeArea sizes={sizes} setSizes={setSizes}/>
                <div className="module-spacer--small" />
                <div className="center">
                    <PrimaryButton 
                        label={"?????????????????????"}
                        onClick={() => dispatch(saveProduct(id, name,description,category,gender,price, images, sizes))}
                    />
                </div>
            </div>
        </section>
    )
}

export default ProductEdit;