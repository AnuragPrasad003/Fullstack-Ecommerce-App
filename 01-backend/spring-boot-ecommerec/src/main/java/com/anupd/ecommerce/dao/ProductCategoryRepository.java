package com.anupd.ecommerce.dao;

import com.anupd.ecommerce.entity.ProductCategory;
import com.anupd.ecommerce.projection.ProductCategoryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("https://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "productCategory",path = "product-category",excerptProjection = ProductCategoryProjection.class)
public interface ProductCategoryRepository extends JpaRepository<ProductCategory,Long> {
}
