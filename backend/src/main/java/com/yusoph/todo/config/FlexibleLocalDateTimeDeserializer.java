package com.yusoph.todo.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class FlexibleLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    private static final DateTimeFormatter DATE_TIME_WITH_MILLIS_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateString = p.getValueAsString();
        
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }
        
        dateString = dateString.trim();
        
        try {
            // Try parsing as full datetime with milliseconds
            if (dateString.contains("T") && dateString.contains(".")) {
                return LocalDateTime.parse(dateString, DATE_TIME_WITH_MILLIS_FORMATTER);
            }
            // Try parsing as full datetime without milliseconds
            else if (dateString.contains("T")) {
                return LocalDateTime.parse(dateString, DATE_TIME_FORMATTER);
            }
            // Try parsing as date only (default to start of day)
            else {
                LocalDate date = LocalDate.parse(dateString, DATE_FORMATTER);
                return date.atStartOfDay();
            }
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Unable to parse date: " + dateString + ". Expected formats: yyyy-MM-dd or yyyy-MM-dd'T'HH:mm:ss[.SSS]", e);
        }
    }
}