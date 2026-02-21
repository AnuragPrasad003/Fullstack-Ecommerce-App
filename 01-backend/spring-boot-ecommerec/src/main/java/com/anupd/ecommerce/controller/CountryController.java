package com.anupd.ecommerce.controller;

import com.anupd.ecommerce.dao.CountryRepository;
import com.anupd.ecommerce.entity.Country;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
//@CrossOrigin("https://localhost:4200")
public class CountryController {

    private final CountryRepository countryRepository;

    public CountryController(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    @GetMapping
    public List<Country> getCountries() {
        return countryRepository.findAll();
    }
}
