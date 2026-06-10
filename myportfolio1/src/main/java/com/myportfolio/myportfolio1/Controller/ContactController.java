package com.myportfolio.myportfolio1.Controller;

import com.myportfolio.myportfolio1.Entity.Contect;
import com.myportfolio.myportfolio1.Service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactService service;

    // CREATE
    @PostMapping
    public Contect createContact(@RequestBody Contect contact) {
        return service.saveContact(contact);
    }

    // GET ALL
        @GetMapping
        public List<Contect> getAllContacts() {

            return service.getAllContacts();
        }

    // GET BY ID
    @GetMapping("/{id}")
    public Contect getContactById(@PathVariable Long id) {
        return service.getContactById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Contect updateContact(
            @PathVariable Long id,
            @RequestBody Contect contact) {

        return service.updateContact(id, contact);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteContact(@PathVariable Long id) {

        service.deleteContact(id);

        return "Contact Deleted Successfully";
    }
}