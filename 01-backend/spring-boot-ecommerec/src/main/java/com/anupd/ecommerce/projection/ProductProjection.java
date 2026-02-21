package com.anupd.ecommerce.projection;

import com.anupd.ecommerce.entity.Product;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(name = "productInline", types = Product.class)
public interface ProductProjection {

    Long getId();
    String getSku();
    String getName();
    String getDescription();
    BigDecimal getUnitPrice();
    String getImageUrl();
    boolean isActive();
    int getUnitsInStock();

    ProductCategoryProjection getCategory();
}
