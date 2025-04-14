package com.smartsched.service;

import com.smartsched.model.Location;
import com.smartsched.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Optional<Location> getLocationById(String id) {
        return locationRepository.findById(id);
    }

    public Location updateLocation(String id, Location updatedLocation) {
        Optional<Location> existing = locationRepository.findById(id);
        if (existing.isPresent()) {
            Location location = existing.get();
            location.setHallName(updatedLocation.getHallName());
            location.setBuildingName(updatedLocation.getBuildingName());
            location.setCapacity(updatedLocation.getCapacity());
            location.setDescription(updatedLocation.getDescription());
            return locationRepository.save(location);
        } else {
            throw new RuntimeException("Location not found with id: " + id);
        }
    }

    public void deleteLocation(String id) {
        locationRepository.deleteById(id);
    }
}
