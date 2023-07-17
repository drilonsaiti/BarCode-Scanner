import React, { Component } from 'react'
import Scanner from './Scanner'
import {TextareaAutosize, Paper} from '@material-ui/core'


class BarcodeScanner extends Component {
    state = {
        results: [],
            data:[{
                barcode: 5310153025351,
                name: 'Rolleti',
                quantity: 1,
                price: 50
            }],
        products: []
    }

    _scan = () => {
        this.setState({ scanning: !this.state.scanning })
    }

    _onDetected = (result) => {
        this.setState({ results: [] });
        this.setState({ results: this.state.results.concat([result]) });
        const productIndex = this.state.data.findIndex(
            (d) => d.barcode === Number(result.codeResult.code)
        );
        console.log(productIndex);
        if (productIndex !== -1) {
            console.log('FOUND');
            this.setState({
                products: this.state.products.concat(this.state.data[productIndex]),
            });
            return true; // Product found
        }
        return false; // Product not found
    };

    render() {

        return (
            <div>

                <span>Barcode Scanner</span>

                <Paper variant="outlined" style={{marginTop:30, width:640, height:320}}>
                    <Scanner onDetected={this._onDetected} />
                </Paper>

                <TextareaAutosize
                    style={{fontSize:32, width:320, height:100, marginTop:30}}
                    rowsMax={4}
                    defaultValue={'No data scanned'}
                    value={this.state.results[0] ? this.state.results[0].codeResult.code : 'No data scanned'}
                />

                {this.state.products.map((res, index) => (
                    <ul key={index}>
                        <li>
                            {res.name} -{" "}
                            <input
                                type="number"
                                value={res.quantity}
                                onChange={(event) => {
                                    const newQuantity = parseInt(event.target.value, 10);
                                    if (!isNaN(newQuantity)) {
                                        const updatedProducts = [...this.state.products];
                                        updatedProducts[index].quantity = newQuantity;
                                        this.setState({ products: updatedProducts });
                                    }
                                }}
                                onInput={(event) => {
                                    if (event.target.value === '') {
                                        const updatedProducts = [...this.state.products];
                                        updatedProducts[index].quantity = '';
                                        this.setState({ products: updatedProducts });
                                    }
                                }}
                            />
                            &nbsp; = &nbsp; {res.quantity * res.price}
                        </li>
                    </ul>
                ))}


            </div>
        )
    }
}

export default BarcodeScanner