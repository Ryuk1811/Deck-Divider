# Security Policy & Vulnerability Disclosure

DECK / divider takes the security and privacy of its users, data vaults, and payment integrations seriously. We appreciate the responsible disclosure of security vulnerabilities by researchers, developers, and users.

This policy outlines how to report vulnerabilities and what you can expect in return.

---

## 1. Supported Versions

Security updates and patches are actively applied to the main branch and deployed directly to production:

| Version / Branch | Supported | Notes |
| :--- | :--- | :--- |
| `main` (Latest) | :white_check_mark: | Deployed to [https://deckdivider.app](https://deckdivider.app) |
| Older releases / forks | :x: | Unsupported; please verify on latest production |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability, **do NOT create a public issue, discussion, or pull request**. Public disclosure before a fix is available exposes user collections and configurations to risk.

### Preferred Reporting Channel
- **Email**: [mailto:deckdivider@outlook.com](mailto:deckdivider@outlook.com)
- **Subject Line**: `[SECURITY VULNERABILITY] <Brief Description>`
- **RFC 9116 Endpoint**: `https://deckdivider.app/.well-known/security.txt`

### What to Include in Your Report
To help us triage and resolve the issue quickly, please provide:
1. **Description**: Clear explanation of the potential vulnerability and its impact.
2. **Steps to Reproduce**: Exact step-by-step instructions or proof-of-concept (PoC) payload.
3. **Affected Endpoints**: Specific API routes, client components, or server middlewares involved.
4. **Environment**: Browser version, operating system, and network setup used during testing.
5. **Mitigation Suggestion**: Any proposed remediation or code change, if known.

---

## 3. Response & Remediation Timeline

When you report a vulnerability via `deckdivider@outlook.com`:

| Milestone | Target Timeline | Description |
| :--- | :--- | :--- |
| **Initial Acknowledgment** | Within 24–48 hours | Confirmation that your report was received and assigned. |
| **Triage & Validation** | Within 7 business days | Assessment of severity (CVSS score) and reproduction confirmation. |
| **Fix & Deployment** | Within 14–30 business days | Development, testing, and deployment of a patch to production. |
| **Coordinated Disclosure** | 90 days standard | Public disclosure or CVE assignment after user safety is secured. |

---

## 4. Scope & Safe Harbor

### In-Scope
- Cross-Site Scripting (XSS) or HTML injection in client binders, deck lists, or shareable cards.
- Server-Side Request Forgery (SSRF) or Remote Code Execution (RCE) in Express ingress.
- Authentication bypass or privilege escalation in Firebase Admin / auth middlewares.
- Entitlement bypass allowing unauthorized tier escalation or bypassing PayPal subscription checks.
- Sensitive credential leakage (service account keys, PayPal secrets, private user email addresses).

### Out-of-Scope
- Denial of Service (DoS/DDoS) attacks against production infrastructure or third-party gateways.
- Spam, social engineering, phishing, or physical attacks against maintainers or users.
- Automated vulnerability scanner reports without a verified, reproducible exploit path.
- Attacks requiring physical access to an unlocked victim workstation.
- Missing HTTP headers that do not directly lead to a demonstrable exploit.

### Safe Harbor Guarantee
If you conduct security research in accordance with this policy:
- We will not pursue civil or criminal action against you.
- We will work cooperatively with you to understand and resolve the issue.
- We will publicly acknowledge your responsible disclosure (with your consent) in our release notes and `/about` acknowledgments.

Thank you for helping keep DECK / divider secure!
