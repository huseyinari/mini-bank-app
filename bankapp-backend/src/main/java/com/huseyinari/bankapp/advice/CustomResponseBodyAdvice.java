package com.huseyinari.bankapp.advice;

import com.huseyinari.bankapp.exception.GlobalExceptionHandler;
import com.huseyinari.bankapp.response.BankApplicationApiResponseBody;
import org.springdoc.webmvc.api.OpenApiWebMvcResource;
import org.springdoc.webmvc.ui.SwaggerConfigResource;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class CustomResponseBodyAdvice implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        boolean fromExceptionHandler = returnType.getContainingClass().equals(GlobalExceptionHandler.class);
        // GlobalExceptionHandler sınıfındaki metotlardan zaten ResponseEntity içerisinde BankApplicationApiResponse döneceği için burada ele alınmasına gerek yok.

        boolean fromSwagger = returnType.getContainingClass().equals(SwaggerConfigResource.class) || returnType.getContainingClass().equals(OpenApiWebMvcResource.class);
        // swagger'ın kendi kullandığı request'lerde response body değiştirilmesin.

        return !fromExceptionHandler && !fromSwagger;
    }

    @Override
    public BankApplicationApiResponseBody<Object> beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        return BankApplicationApiResponseBody.builder()
                .responseTime(LocalDateTime.now())
                .data(body)
                .errors(null)
                .build();
    }
}
