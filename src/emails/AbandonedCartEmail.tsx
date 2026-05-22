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

export interface AbandonedCartEmailProps {
  name: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  checkoutLink: string;
}

const BRAND_CREAM = '#F5E6DA';
const BRAND_BROWN = '#3B2F2F';
const BRAND_BEIGE = '#E8CCAE';

export default function AbandonedCartEmail({
  name,
  items,
  totalAmount,
  checkoutLink,
}: AbandonedCartEmailProps) {
  const formattedTotal = `Rs. ${totalAmount.toLocaleString('en-IN')}`;

  return (
    <Html>
      <Head />
      <Preview>You left something behind — complete your Viraasat order</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brandName}>VIRAASAT</Heading>
            <Text style={brandTagline}>Rooted in craft. Worn with pride.</Text>
          </Section>

          <Section style={heroBand}>
            <Text style={heroLabel}>CART RECOVERY</Text>
            <Heading style={heroTitle}>Your cart is waiting!</Heading>
          </Section>

          <Section style={contentSection}>
            <Text style={greeting}>Hi {name},</Text>
            <Text style={bodyText}>
              You added some beautiful pieces to your cart but didn&apos;t
              complete the purchase. They&apos;re still waiting for you!
            </Text>

            <Section style={itemsBox}>
              {items.map((item, i) => (
                <Text key={i} style={itemText}>
                  {item.name} × {item.quantity} —{' '}
                  <strong>Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                </Text>
              ))}
            </Section>

            <Section style={totalRow}>
              <Text style={totalLabel}>TOTAL</Text>
              <Text style={totalAmount_}>{formattedTotal}</Text>
            </Section>

            <Section style={buttonWrapper}>
              <a href={checkoutLink} style={button}>
                Complete Your Order
              </a>
            </Section>
          </Section>

          <Hr style={divider} />

          <Section style={contentSection}>
            <Text style={bodyText}>
              If you have any questions about sizing or fabrics, just reply to
              this email — we&apos;re happy to help.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
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

const itemsBox: React.CSSProperties = {
  backgroundColor: BRAND_CREAM,
  borderRadius: '12px',
  padding: '16px',
  margin: '16px 0',
};

const itemText: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '13px',
  margin: '0 0 6px',
  lineHeight: '1.6',
};

const totalRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderTop: `1px solid ${BRAND_BEIGE}`,
  marginTop: '8px',
};

const totalLabel: React.CSSProperties = {
  color: '#8C6E5D',
  fontSize: '11px',
  letterSpacing: '0.2em',
  fontWeight: 700,
  margin: 0,
};

const totalAmount_: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '22px',
  fontWeight: 700,
  margin: 0,
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
  color: '#BCA99A',
  fontSize: '11px',
  letterSpacing: '0.1em',
  margin: 0,
};
