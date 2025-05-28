import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
  Image,
} from '@react-pdf/renderer';

// Modern color scheme and layout styles with better spacing
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginBottom: 28,
    padding: 20,
    paddingTop: 28, // extra padding top so heading doesn't overlap
    backgroundColor: '#ffffff',
    borderRadius: 12,
    // react-pdf does not support boxShadow, so omit or use border only
    border: '1px solid #dee2e6',
  },
  headingContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  underline: {
    height: 3,
    width: 60,
    backgroundColor: '#3498db',
    marginTop: 4,
    borderRadius: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  row: {
    marginBottom: 4,
    color: '#34495e',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#2980b9',
  },
  tableCell: {
    padding: 6,
    flexGrow: 1,
    borderRight: '1px solid #ccc',
    borderBottom: '1px solid #ccc',
    color: '#2c3e50',
  },
  tableHeaderCell: {
    padding: 6,
    flexGrow: 1,
    fontWeight: 'bold',
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    border: '2px solid #3498db',
  },
  profileDetails: {
    flexGrow: 1,
  },
});

const SectionHeading = ({ children }) => (
  <View style={styles.headingContainer}>
    <Text style={styles.heading}>{children}</Text>
    <View style={styles.underline} />
  </View>
);

const StudentReportPDF = ({ user, CAresults, studentProjects }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Profile Section */}
      <View style={styles.section}>
        <SectionHeading>Profile Details</SectionHeading>
        <View style={styles.profileHeader}>
          <View style={styles.profileDetails}>
            <Text style={styles.row}>
              <Text style={styles.label}>Name:</Text> {user.name}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Roll Number:</Text> {user.rollnumber}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Branch:</Text> {user.branch}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Year:</Text> {user.year}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Email:</Text> {user.email}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Phone:</Text> {user.phnumber}
            </Text>
          </View>
          {user.profilePhoto && (
            <Image style={styles.profileImage} src={user.profilePhoto} />
          )}
        </View>
      </View>

      {/* Semester Results */}
      {user.results?.length > 0 && (
        <View style={styles.section}>
          <SectionHeading>Semester Results</SectionHeading>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCell}>Semester</Text>
              <Text style={styles.tableHeaderCell}>CGPA</Text>
              <Text style={styles.tableHeaderCell}>PDF Link</Text>
            </View>
            {user.results.map((r, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCell}>{r.semester}</Text>
                <Text style={styles.tableCell}>{r.averageCGPA}</Text>
                <Text style={styles.tableCell}>
                  {r.pdflink ? <Link src={r.pdflink}>View</Link> : 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Projects */}
      {studentProjects?.length > 0 && (
        <View style={styles.section}>
          <SectionHeading>Projects</SectionHeading>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCell}>Name</Text>
              <Text style={styles.tableHeaderCell}>Description</Text>
              <Text style={styles.tableHeaderCell}>Mentor</Text>
              <Text style={styles.tableHeaderCell}>Link</Text>
            </View>
            {studentProjects.map((p, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCell}>{p.projectName}</Text>
                <Text style={styles.tableCell}>
                  {p.description.slice(0, 30)}...
                </Text>
                <Text style={styles.tableCell}>{p.mentor?.name || 'N/A'}</Text>
                <Text style={styles.tableCell}>
                  {p.pdfLink ? <Link src={p.pdfLink}>PDF</Link> : 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Internal Marks */}
      {CAresults?.length > 0 && (
        <View style={styles.section}>
          <SectionHeading>Internal Marks</SectionHeading>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCell}>Subject Code</Text>
              <Text style={styles.tableHeaderCell}>Obtained</Text>
              <Text style={styles.tableHeaderCell}>Total</Text>
              <Text style={styles.tableHeaderCell}>Mentor</Text>
              <Text style={styles.tableHeaderCell}>Attendance</Text>
            </View>
            {CAresults.map((c, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCell}>{c.subjectCode}</Text>
                <Text style={styles.tableCell}>{c.marksObtained}</Text>
                <Text style={styles.tableCell}>{c.totalMarks}</Text>
                <Text style={styles.tableCell}>{c.mentor}</Text>
                <Text style={styles.tableCell}>{c.attendance}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Semester-wise Attendance */}
      {user.attendance && user.attendance.length > 0 && (
        <View style={styles.section}>
          <SectionHeading>📅 Semester-wise Attendance</SectionHeading>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCell}>Semester</Text>
              <Text style={styles.tableHeaderCell}>Attendance (%)</Text>
            </View>
            {user.attendance.map((a, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCell}>{a.semester}</Text>
                <Text style={styles.tableCell}>{a.percentage}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
);

export default StudentReportPDF;
