package com.smartsched.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("customSecurity")
public class CustomSecurity {

    public boolean checkUserRoles(Authentication authentication, String... rolesAllowed) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String userRole = authentication.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", "").toLowerCase())
                .orElse("");

        for (String role : rolesAllowed) {
            if (userRole.equals(role.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}
