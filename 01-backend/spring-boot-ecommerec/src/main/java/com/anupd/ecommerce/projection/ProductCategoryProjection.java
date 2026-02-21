package com.anupd.ecommerce.projection;

import com.anupd.ecommerce.entity.ProductCategory;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "categoryInline", types = ProductCategory.class)
public interface ProductCategoryProjection {

    Long getId();
    String getCategoryName();
}
