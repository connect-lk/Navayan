import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles matching the exact design
const styles = StyleSheet.create({
  page: {
    padding: 25,
    paddingTop: 0,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  // orangeLine: {
  //   height: 4,
  //   backgroundColor: "#EF6136",
  //   borderTopWidth: 1,
  //   borderTopColor: "#EF6136",
  //   width: "100%",
  //   marginBottom: 0,
  // },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 12,
    paddingTop: 12,
    // paddingLeft: 25,
    // paddingRight: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    width: "100%",
  },
  // Grid cols-4 equivalent: col-span-1 (1/4 = 25%)
  headerLeft: {
    flex: 1,
    width: "25%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginRight: 24,
    left: 0,
  },
  // Grid cols-4 equivalent: col-span-2 (2/4 = 50%)
  headerCenter: {
    flex: 2,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 24,
  },
  // Grid cols-4 equivalent: col-span-1 (1/4 = 25%)
  headerRight: {
    flex: 1,
    width: "25%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  logoImage: {
    width: 100,
    height: 50,
    objectFit: "cover",
  },
  projectLogoImage: {
    width: 120,
    height: 60,
    objectFit: "contain",
  },
  quotationBox: {
    padding: 12,
    width: "100%",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6600",
    marginBottom: 3,
  },
  companySubtitle: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  projectName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 2,
  },
  projectSubtitle: {
    fontSize: 10,
    color: "#666666",
    fontStyle: "italic",
  },
  quotationTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 3,
    textAlign: "right",
  },
  quotationNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#EF6136",
    marginBottom: 3,
    textAlign: "right",
    fontFamily: "Courier",
  },
  quotationDate: {
    fontSize: 9,
    color: "#374151",
    textAlign: "right",
  },
  section: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 6,
  },
  twoColumn: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 4,
    fontSize: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#4A4A4A",
  },
  value: {
    color: "#333333",
    fontSize: 10,
  },
  propertyGrid: {
    flexDirection: "row",
    marginTop: 8,
    padding: 12,
  },
  propertyColumn: {
    width: "50%",
    paddingRight: 6,
  },
  propertyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  propertyLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4A4A4A",
    width: "33%",
  },
  propertyValue: {
    fontSize: 10,
    color: "#666666",
    width: "67%",
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  tableHeader: {
    backgroundColor: "#F5F5F5",
    padding: 8,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333333",
  },
  tableCell: {
    padding: 8,
    flex: 1,
  },
  tableCellLeft: {
    textAlign: "left",
  },
  tableCellRight: {
    textAlign: "right",
    fontSize: 11,
  },
  tableCellText: {
    fontSize: 11,
    color: "#333333",
  },
  tableCellBold: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333333",
  },
  tableCellOrange: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#EF6136",
  },
  tableCellBlue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#EF6136",
  },
  indentedCell: {
    paddingLeft: 20,
  },
  amountInWords: {
    marginTop: 10,
    fontSize: 10,
  },
  amountLabel: {
    color: "#666666",
    marginBottom: 4,
  },
  amountValue: {
    fontWeight: "bold",
    color: "#333333",
  },
  termsList: {
    marginTop: 8,
  },
  termItem: {
    flexDirection: "row",
    marginBottom: 10,
    fontSize: 12,
    color: "#333333",
  },
  termNumber: {
    width: 20,
    color: "#EF6136",
  },
  footer: {
    paddingBottom: 20,
    paddingLeft: 20,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#666666",
  },
});

const QuotationPDF = ({ quotationData }) => {
  // Format currency for PDF
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Blue Line */}
        <View style={styles.orangeLine} />

        {/* Header Section */}
        <View style={styles.header}>
          {/* Left Column - Company Logo */}
          <View style={styles.headerLeft}>
            <Image
              src="/images/Screenshot_20.png"
              style={styles.logoImage}
              quality={95}
            />
          </View>

          {/* Center Column - Project Logo */}
          <View style={styles.headerCenter}>
            <Image
              src="/images/Screenshot_17.png"
              style={styles.projectLogoImage}
            />
          </View>

          {/* Right Column - Quotation Info */}
          <View style={styles.headerRight}>
            <View style={styles.quotationBox}>
              <Text style={styles.quotationTitle}>QUOTATION</Text>
              <Text style={styles.quotationNumber}>
                {quotationData.quotationNumber}
              </Text>
              <Text style={styles.quotationDate}>
                {quotationData.date}, {quotationData.time}
              </Text>
            </View>
          </View>
        </View>

        {/* Company and Customer Information */}
        <View style={styles.section}>
          <View style={styles.twoColumn}>
            {/* Company Information */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>
                {quotationData.company.name}
              </Text>
              <Text style={styles.infoRow}>
                <Text style={styles.label}>Prepared by: </Text>
                <Text style={styles.value}>{quotationData.company.preparedBy}</Text>
              </Text>
              <Text style={styles.infoRow}>
                <Text style={styles.label}>Contact: </Text>
                <Text style={styles.value}>
                  {quotationData.company.contact} | {quotationData.company.phone}
                </Text>
              </Text>
              <Text style={styles.infoRow}>
                <Text style={styles.label}>Address: </Text>
                <Text style={styles.value}>{quotationData.company.address}</Text>
              </Text>
              <Text style={styles.infoRow}>
                <Text style={styles.label}>GSTN: </Text>
                <Text style={styles.value}>{quotationData.company.gstn}</Text>
              </Text>
              <Text style={styles.infoRow}>
                <Text style={styles.label}>PAN: </Text>
                <Text style={styles.value}>{quotationData.company.pan}</Text>
              </Text>
            </View>

            {/* Customer Information */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              <Text style={styles.infoRow}>
                <Text style={styles.label}>Name: </Text>
                <Text style={styles.value}>{quotationData.customer.name}</Text>
              </Text>
              <Text style={styles.infoRow}>
                <Text style={styles.label}>Contact Number: </Text>
                <Text style={styles.value}>
                  {quotationData.customer.contactNumber}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Property Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.propertyGrid}>
            {/* Left Column */}
            <View style={styles.propertyColumn}>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Property Name:</Text>
                <Text style={styles.propertyValue}>{quotationData.property.name}</Text>
              </View>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Accommodation:</Text>
                <Text style={styles.propertyValue}>
                  {quotationData.property.accommodation}
                </Text>
              </View>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Unit No:</Text>
                <Text style={styles.propertyValue}>{quotationData.property.unitNo}</Text>
              </View>
            </View>
            {/* Right Column */}
            <View style={styles.propertyColumn}>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Floor:</Text>
                <Text style={styles.propertyValue}>{quotationData.property.floor}</Text>
              </View>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Apartment Area:</Text>
                <Text style={styles.propertyValue}>
                  {quotationData.property.apartmentArea}
                </Text>
              </View>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Parking & Level:</Text>
                <Text style={styles.propertyValue}>
                  {quotationData.property.parkingLevel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Property Cost */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Cost</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text style={styles.tableHeaderText}>DESCRIPTION</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableHeaderText, styles.tableCellRight]}>
                  AMOUNT
                </Text>
              </View>
            </View>

            {/* Basic Cost */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text style={styles.tableCellText}>Basic cost of property</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableCellText, styles.tableCellRight]}>
                  {formatCurrency(quotationData.costs.basicCost)}
                </Text>
              </View>
            </View>

            {/* Additional Charges Header */}
            <View style={[styles.tableRow, { backgroundColor: "#F9F9F9" }]}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text style={styles.tableCellBold}>Additional Charges:</Text>
              </View>
              <View style={styles.tableCell}></View>
            </View>

            {/* IBMS */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 2 }, styles.indentedCell]}>
                <Text style={styles.tableCellText}>
                  IBMS (Interest Bearing Maintenance Security)
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableCellText, styles.tableCellRight]}>
                  {formatCurrency(quotationData.costs.additionalCharges.ibms)}
                </Text>
              </View>
            </View>

            {/* EDC */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 2 }, styles.indentedCell]}>
                <Text style={styles.tableCellText}>
                  EDC (Electricity Development Charges)
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableCellText, styles.tableCellRight]}>
                  {formatCurrency(quotationData.costs.additionalCharges.edc)}
                </Text>
              </View>
            </View>

            {/* Club Membership */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 2 }, styles.indentedCell]}>
                <Text style={styles.tableCellText}>Club Membership Fees</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableCellText, styles.tableCellRight]}>
                  {formatCurrency(
                    quotationData.costs.additionalCharges.clubMembership
                  )}
                </Text>
              </View>
            </View>

            {/* Legal Charges */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 2 }, styles.indentedCell]}>
                <Text style={styles.tableCellText}>Legal Charges</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableCellText, styles.tableCellRight]}>
                  {formatCurrency(
                    quotationData.costs.additionalCharges.legalCharges
                  )}
                </Text>
              </View>
            </View>

            {/* Subtotal */}
            <View style={[styles.tableRow, { backgroundColor: "#F5F5F5" }]}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text style={styles.tableCellBold}>Subtotal</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableCellBold, styles.tableCellRight]}>
                  {formatCurrency(quotationData.costs.subtotal)}
                </Text>
              </View>
            </View>

            {/* Total Amount */}
            <View style={[styles.tableRow, { backgroundColor: "#F5F5F5" }]}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text style={styles.tableCellBlue}>Total Amount</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableCellBlue, styles.tableCellRight]}>
                  {formatCurrency(quotationData.costs.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.section}>
          <View style={styles.amountInWords}>
            <Text style={styles.amountLabel}>Amount in Words:</Text>
            <Text style={styles.amountValue}>
              One Crore Sixty Eight Lakh Sixty Five Thousand Rupees Only
            </Text>
          </View>
        </View>

        {/* Payment Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Schedule</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text style={styles.tableHeaderText}>MILESTONE</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeaderText}>DATE</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableHeaderText, styles.tableCellRight]}>
                  AMOUNT
                </Text>
              </View>
            </View>

            {/* Payment Rows */}
            {quotationData.paymentSchedule.map((payment, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <Text style={styles.tableCellText}>{payment.milestone}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableCellText}>{payment.date}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableCellText, styles.tableCellRight]}>
                    {formatCurrency(payment.amount)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Total Scheduled */}
            <View style={[styles.tableRow, { backgroundColor: "#F5F5F5" }]}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text style={styles.tableCellBlue}>Total Scheduled</Text>
              </View>
              <View style={styles.tableCell}></View>
              <View style={styles.tableCell}>
                <Text style={[styles.tableCellBlue, styles.tableCellRight]}>
                  {formatCurrency(quotationData.costs.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <View style={styles.termsList}>
            {quotationData.termsAndConditions.map((term, index) => (
              <View key={index} style={styles.termItem}>
                <Text style={styles.termNumber}>{index + 1}.</Text>
                <Text style={{ flex: 1, marginLeft: 5 }}>{term}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            {quotationData.company.name} | {quotationData.company.contact}
          </Text>
          <Text>Computer generated quotation</Text>
          <Text>1/1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuotationPDF;

