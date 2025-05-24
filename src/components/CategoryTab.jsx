import React from 'react'
import '../assets/styles/categorytabstyles.css'
import { Spinner } from 'react-bootstrap'


const CategoryTab = ({ categories, toggleCategory, activeCategories, itemLoading = {} }) => {

 return (
    <div className="category-container">
        {categories.map((category) => (
        <div
        key={category.categoryId}
        className={`category-box ${activeCategories.has(category.categoryId) ? 'active' : ''}`}
        onClick={() => toggleCategory(category.categoryId)}>
          {itemLoading[category.categoryId] ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        category.categoryName
           )}
        </div>
        ))}
    </div>
  )
}

export default CategoryTab