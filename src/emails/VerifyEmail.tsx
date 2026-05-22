import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export interface VerifyEmailProps {
  name: string;
  verifyLink: string;
}

const BRAND_CREAM = '#F5E6DA';
const BRAND_BROWN = '#3B2F2F';
const BRAND_BEIGE = '#E8CCAE';

export default function VerifyEmail({
  name,
  verifyLink,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address to activate your Viraasat account</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brandName}>VIRAASAT</Heading>
            <Text style={brandTagline}>Rooted in craft. Worn with pride.</Text>
          </Section>

          <Section style={heroBand}>
            <Text style={heroLabel}>WELCOME</Text>
            <Heading style={heroTitle}>Verify your email</Heading>
          </Section>

          <Section style={contentSection}>
            <Text style={greeting}>Hi {name},</Text>
            <Text style={bodyText}>
              Thanks for creating a Viraasat account! Please verify your email
              address to activate your account and start shopping. This link is
              valid for <strong>24 hours</strong>.
            </Text>

            <Section style={buttonWrapper}>
              <a href={verifyLink} style={button}>
                Verify Email
              </a>
            </Section>

            <Text style={fallbackText}>
              If the button above doesn&apos;t work, copy and paste this link
              into your browser:
            </Text>
            <Text style={linkText}>{verifyLink}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={contentSection}>
            <Text style={bodyText}>
              If you didn&apos;t create an account, you can safely ignore this
              email.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or visit{' '}
              <a
                href="https://viraasatclothing.store/contact"
                style={footerLink}
              >
                our contact page
              </a>
              .
            </Text>
            <Text style={footerBrand}>
              © {new Date().getFullYear()} Viraasat — Handcrafted in India
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#FAF5F0',
  fontFamily: "'Georgia', 'Times New Roman', serif",
  margin: 0,
  padding: '32px 0',
};

const container: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  overflow: 'hidden',
  border: `1px solid ${BRAND_BEIGE}`,
};

const header: React.CSSProperties = {
  backgroundColor: BRAND_BROWN,
  padding: '36px 40px 28px',
  textAlign: 'center',
};

const brandName: React.CSSProperties = {
  color: BRAND_CREAM,
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '0.35em',
  margin: '0 0 4px',
};

const brandTagline: React.CSSProperties = {
  color: `${BRAND_CREAM}99`,
  fontSize: '11px',
  letterSpacing: '0.15em',
  margin: 0,
};

const heroBand: React.CSSProperties = {
  backgroundColor: BRAND_CREAM,
  padding: '24px 40px',
  textAlign: 'center',
  borderBottom: `2px solid ${BRAND_BEIGE}`,
};

const heroLabel: React.CSSProperties = {
  color: '#8C6E5D',
  fontSize: '10px',
  letterSpacing: '0.3em',
  fontWeight: 700,
  margin: '0 0 6px',
};

const heroTitle: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '24px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  margin: 0,
};

const contentSection: React.CSSProperties = {
  padding: '24px 40px',
};

const greeting: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '18px',
  fontWeight: 600,
  margin: '0 0 8px',
};

const bodyText: React.CSSProperties = {
  color: '#5C4B3B',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0 0 16px',
};

const buttonWrapper: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0',
};

const button: React.CSSProperties = {
  backgroundColor: BRAND_BROWN,
  color: '#FFFFFF',
  padding: '14px 36px',
  borderRadius: '40px',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textDecoration: 'none',
  display: 'inline-block',
};

const fallbackText: React.CSSProperties = {
  color: '#8C6E5D',
  fontSize: '12px',
  margin: '16px 0 4px',
};

const linkText: React.CSSProperties = {
  color: '#8C6E5D',
  fontSize: '11px',
  fontFamily: 'monospace',
  wordBreak: 'break-all',
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: BRAND_BEIGE,
  borderTopWidth: '1px',
  margin: 0,
};

const footer: React.CSSProperties = {
  backgroundColor: BRAND_CREAM,
  padding: '20px 40px',
  textAlign: 'center',
  borderTop: `1px solid ${BRAND_BEIGE}`,
};

const footerText: React.CSSProperties = {
  color: '#8C6E5D',
  fontSize: '12px',
  margin: '0 0 6px',
};

const footerLink: React.CSSProperties = {
  color: BRAND_BROWN,
  fontWeight: 600,
};

const footerBrand: React.CSSProperties = {
  color: '#BCA99A',
  fontSize: '11px',
  letterSpacing: '0.1em',
  margin: 0,
};
