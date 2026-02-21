package com.anupd.ecommerce.projection;

import com.anupd.ecommerce.entity.Country;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "default", types = Country.class)
public interface CountryProjection {

    int getId();
    String getCode();
    String getName();
}
