import Loader from 'react-loader-spinner'

import {Component} from 'react'

import Cookies from 'js-cookie'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

class ProductItemDetails extends Component {
  state = {
    firstList: [],
    secondList: [],
    loding: true,
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const aboutProduct = {
        title: fetchedData.title,
        brand: fetchedData.brand,
        price: fetchedData.price,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        rating: fetchedData.rating,
        description: fetchedData.description,
        availability: fetchedData.availability,
      }
      console.log(aboutProduct)
      const updatedData = fetchedData.similar_products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
        availability: product.availability,
        description: product.description,
        style: product.style,
        totalReviews: product.total_reviews,
      }))
      console.log(updatedData)
      this.setState({
        firstList: aboutProduct,
        secondList: updatedData,
        loding: false,
      })
    }
  }

  render() {
    const {firstList, secondList, loding} = this.state
    const {
      title,
      brand,
      imageUrl,
      rating,
      price,
      description,
      availability,
      style,
    } = firstList
    console.log(firstList)
    return (
      <>
        <Header />
        {loding && (
          <div className="primedeals-loader-container">
            <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
          </div>
        )}
        {!loding && (
          <div className="surya">
            <h1 className="main-heading">Similar Products</h1>
            <li className="product-item">
              <img src={imageUrl} alt="product" className="thumbnail" />
              <h1 className="title">{title}</h1>
              <p className="brand">by {brand}</p>
              <div className="product-details">
                <p className="price">Rs {price}/-</p>
                <div className="rating-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
              </div>
              <p> {description}</p>
              <div className="product-details">
                <h1>Available</h1>
                <p>{availability}</p>
              </div>
              <div className="product-details">
                <h1>Brand</h1>
                <p>{style}</p>
              </div>
            </li>
            <ul className="products-list">
              {secondList.map(product => (
                <SimilarProductItem productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        )}
      </>
    )
  }
}

export default ProductItemDetails
