import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LogContext } from '../Context/LogContext';

const DashboardScreen = () => {
  const { logs, clearLogs, deviceId, customerName, timestamp, rfChannel } = useContext(LogContext);

  const handleClearPress = () => {
    Alert.alert(
      'Clear All Logs',
      'Are you sure you want to clear all the logs?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => clearLogs(),
        },
      ],
      { cancelable: true }
    );
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Ionicons name="ellipse" size={8} color="#007AFF" style={styles.bullet} />
      <Text style={styles.logText}>{item}</Text>
    </View>
  );

  const renderSettingItem = ({ item }) => (
    <View style={styles.logItem}>
      <Ionicons name="ellipse" size={8} color="#007AFF" style={styles.bullet} />
      <Text style={styles.logText}>{item.key}: {item.value || 'N/A'}</Text>
    </View>
  );

  const settingsData = [
    { key: 'Device ID', value: deviceId || 'N/A' },
    { key: 'Customer Name', value: customerName || 'N/A' },
    { key: 'Timestamp', value: timestamp || 'N/A' },
    { key: 'RF Channel', value: rfChannel || 'N/A' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Settings</Text>
      </View>

      <View style={styles.logsContainer}>
        <FlatList
          data={settingsData}
          renderItem={renderSettingItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={[styles.header, { marginTop: 24 }]}>
        <Text style={styles.title}>Activity Logs</Text>
        <TouchableOpacity 
          onPress={handleClearPress} 
          style={styles.clearButton}
          disabled={!logs || logs.length === 0}
        >
          <Ionicons 
            name="trash-bin-outline" 
            size={24} 
            color={(!logs || logs.length === 0) ? "#CCCCCC" : "#FF3B30"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.logsContainer}>
        {!logs || logs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={40} color="#AEAEB2" />
            <Text style={styles.emptyText}>No activity recorded yet</Text>
          </View>
        ) : (
          <FlatList
            data={logs}
            renderItem={renderLogItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E99F', // Light yellow
    padding: 16,
  },
  header: {
    fontSize: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,  
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FF6D60', // Coral red
  },
  clearButton: {
    padding: 8,
  },
  deviceInfo: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6D60', // Coral red
    marginBottom: 4,
    textDecorationLine: 'underline',
    textDecorationColor: '#F7D060', // Yellow underline
  },
  logsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#98D8AA', // Light green left border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  scrollContent: {
    paddingVertical: 12,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  bullet: {
    marginRight: 12,
  },
  logText: {
    flex: 1,
    fontSize: 15,
    color: '#2C2C2E',
    lineHeight: 22,
  },
});

export default DashboardScreen;