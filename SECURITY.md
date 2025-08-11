# Security Policy

## Supported Versions

We actively support the following versions of React Meta Framework:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅ Yes             |
| < 0.1   | ❌ No              |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in React Meta Framework, please follow these steps:

### 1. **DO NOT** create a public GitHub issue
Public issues can be exploited by malicious actors before we can fix them.

### 2. **DO** report the vulnerability privately
Send an email to [security@reactmeta.dev](mailto:security@reactmeta.dev) with:
- A detailed description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any additional context or proof-of-concept code

### 3. **DO** use GitHub Security Advisories (if you have access)
If you have access to the repository, you can create a private security advisory:
1. Go to the repository's "Security" tab
2. Click "Security advisories"
3. Click "New security advisory"
4. Fill in the details and mark as private

## Response Timeline

We commit to responding to security reports within:
- **Initial response**: 24 hours
- **Status update**: 48 hours
- **Fix timeline**: 7-14 days (depending on severity)

## Severity Levels

We use the following severity levels for security issues:

| Level | Description | Response Time |
|-------|-------------|---------------|
| **Critical** | Remote code execution, authentication bypass | 24-48 hours |
| **High** | Data exposure, privilege escalation | 48-72 hours |
| **Medium** | Information disclosure, CSRF | 1-2 weeks |
| **Low** | Minor issues, best practice violations | 2-4 weeks |

## Disclosure Policy

1. **Private disclosure**: We will work with you privately to understand and fix the issue
2. **Coordinated disclosure**: We will coordinate the public disclosure with you
3. **Credit**: We will credit you in the security advisory and release notes
4. **Timeline**: We will not disclose the issue until it's fixed and users have had time to update

## Security Best Practices

When using React Meta Framework in production:

1. **Keep dependencies updated**: Regularly update to the latest version
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate inputs**: Validate all user inputs and API responses
4. **Monitor logs**: Monitor application logs for suspicious activity
5. **Security headers**: Implement appropriate security headers
6. **Regular audits**: Conduct regular security audits

## Security Features

React Meta Framework includes several security features:

- **Input sanitization**: Automatic sanitization of user inputs
- **XSS protection**: Built-in XSS protection mechanisms
- **CSRF protection**: CSRF token generation and validation
- **Secure defaults**: Security-focused default configurations
- **Audit logging**: Comprehensive audit logging capabilities

## Contact Information

- **Security Email**: [security@reactmeta.dev](mailto:security@reactmeta.dev)
- **GitHub Security**: Use GitHub Security Advisories if you have access
- **PGP Key**: Available upon request for encrypted communications

## Acknowledgments

We thank all security researchers who responsibly disclose vulnerabilities. Your contributions help make React Meta Framework more secure for everyone.

---

**Thank you for helping keep React Meta Framework secure!** 🔒✨
