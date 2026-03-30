package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/entries")
@CrossOrigin(origins = "*")
public class GuestController {
    
    private final EntryRepository repository;

    public GuestController(EntryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Entry> getEntries() {
        return repository.findAll();
    }

    @PostMapping
    public Entry addEntry(@RequestBody Entry entry) {
        return repository.save(entry);
    }
}
