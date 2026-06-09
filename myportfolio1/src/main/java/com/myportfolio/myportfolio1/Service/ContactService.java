package com.myportfolio.myportfolio1.Service;

import com.myportfolio.myportfolio1.Entity.Contect;
import com.myportfolio.myportfolio1.Repo.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    @Autowired
    private ContactRepository repository;

    public Contect saveContact(Contect contact) {
        return repository.save(contact);
    }

    public List<Contect> getAllContacts() {
        return repository.findAll();
    }

    public Contect getContactById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Contect updateContact(Long id, Contect updatedContact) {

        Contect contact = repository.findById(id).orElse(null);

        if(contact != null) {
            contact.setName(updatedContact.getName());
            contact.setEmail(updatedContact.getEmail());
            contact.setMessage(updatedContact.getMessage());

            return repository.save(contact);
        }

        return null;
    }

    public void deleteContact(Long id) {
        repository.deleteById(id);
    }
}