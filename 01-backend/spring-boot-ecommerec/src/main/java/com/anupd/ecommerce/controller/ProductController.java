package com.anupd.ecommerce.controller;

import com.anupd.ecommerce.dao.ProductRepository;
import com.anupd.ecommerce.dto.ProductDTO;
import com.anupd.ecommerce.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
//@CrossOrigin("https://localhost:4200")
public class ProductController {

    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/products")
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @GetMapping("/products/search/findByCategoryId")
    public Page<ProductDTO> getProductsByCategory(@RequestParam("id") Long id, Pageable pageable) {
        return productRepository.findByCategoryId(id, pageable)
                .map(this::convertToDTO);
    }

    @GetMapping("/products/search/findByNameContaining")
    public Page<ProductDTO> searchProducts(@RequestParam("name") String name, Pageable pageable) {
        return productRepository.findByNameContaining(name, pageable)
                .map(this::convertToDTO);
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setUnitPrice(product.getUnitPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setActive(product.isActive());
        dto.setUnitsInStock(product.getUnitsInStock());
        dto.setDateCreated(product.getDateCreated());
        dto.setLastUpdated(product.getLastUpdated());

        // Set category info
        if (product.getCategory() != null) {
            ProductDTO.CategoryDTO categoryDTO = new ProductDTO.CategoryDTO();
            categoryDTO.setId(product.getCategory().getId());
            categoryDTO.setCategoryName(product.getCategory().getCategoryName());
            dto.setCategory(categoryDTO);
        }

        return dto;
    }
}