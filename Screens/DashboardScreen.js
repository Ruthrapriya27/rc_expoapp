import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Animated, Easing, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LogContext } from '../Context/LogContext';
import { BluetoothContext } from '../Context/BluetoothContext';

const DashboardScreen = () => {
  const { logs, clearLogs, deviceIdcode, customerName, timestamp, deviceID } = useContext(LogContext);
  const [areLogsExpanded, setAreLogsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const { connectedDevice } = useContext(BluetoothContext);
  const [showClearLogsModal, setShowClearLogsModal] = useState(false);

  useEffect(() => {
  }, [connectedDevice]);

  const toggleLogs = () => {
    Animated.timing(animation, {
      toValue: areLogsExpanded ? 0 : 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setAreLogsExpanded(!areLogsExpanded));
  };

  const handleClearPress = () => {
    setShowClearLogsModal(true);
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Ionicons name="ellipse" size={8} color="#007AFF" style={styles.bullet} />
      <Text style={styles.logText}>{item}</Text>
    </View>
  );

  const renderSettingItem = ({ item, index }) => (
    <View style={[
      styles.logItem,
      index === settingsData.length - 1 && { borderBottomWidth: 0 }
    ]}>
      <Ionicons name="ellipse" size={8} color="#007AFF" style={styles.bullet} />
      <Text style={styles.logText}>{item.key}: {item.value || 'N/A'}</Text>
    </View>
  );
  const settingsData = [
    { key: 'Bluetooth Device ID', value: connectedDevice?.name || 'No device connected' },
    { key: 'Device ID Code', value: deviceIdcode || 'N/A' },
    { key: 'Customer Name', value: customerName || 'N/A' },
    { key: 'Timestamp', value: timestamp || 'N/A' },
  ];
  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 298] 
  });

  const rotateArrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Settings</Text>
      </View>

      <View style={styles.logsContainer}>
        <FlatList
          data={settingsData}
          renderItem={({ item, index }) => renderSettingItem({ item, index })}
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

      <TouchableOpacity onPress={toggleLogs} style={styles.toggleButton}>
        <Animated.Text style={[styles.toggleText, { transform: [{ rotate: rotateArrow }] }]}>
          <Ionicons name="chevron-down" size={20} color="#007AFF" />
        </Animated.Text>
        <Text style={styles.toggleLabel}>
          {areLogsExpanded ? 'Hide Logs' : 'Show Logs'}
        </Text>
      </TouchableOpacity>

      <Animated.View style={[
        styles.logsContainer,
        {
          height: containerHeight,
          opacity: animation,
          padding: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 12]
          })
        }
      ]}>
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
      </Animated.View>

      {/* Activity Clear Confirmation Modal */}
      <Modal
        transparent
        visible={showClearLogsModal}
        animationType="fade"
        onRequestClose={() => setShowClearLogsModal(false)}
      >
        <View style={styles.logdelmodalOverlay}>
          <View style={styles.logdelmodalContainer}>
            <Text style={styles.logdelmodalText}>
              Are you sure you want to clear all the logs?
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.logdelmodalButton}
                onPress={() => setShowClearLogsModal(false)}
              >
                <Text style={styles.logdelmodalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logdelmodalButton}
                onPress={() => {
                  clearLogs();
                  setShowClearLogsModal(false);
                }}
              >
                <Text style={styles.logdelmodalButtonText}>Delete All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(26, 115, 232, 0.1)',
    borderRadius: 10,
    marginBottom: 10,
    marginTop: -6,
    alignSelf: 'center',
    minWidth: '60%',
  },
  toggleText: {
    marginRight: 8,
    fontSize: 15,
    color: '#5F6368',
  },
  toggleLabel: {
    color: '#1A73E8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  clearButton: {
    padding: 8,
  },
  logsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 15,
    overflow: 'hidden',
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
    color: '#5F6368',
    textAlign: 'center',
  },
  scrollContent: {
    paddingVertical: 12,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bullet: {
    marginRight: 12,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#FFA000',
  },
  logText: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1C',
    lineHeight: 22,
  },

  // Log Delete Modal
  logdelmodalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  logdelmodalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    width: 300,
    height: 160,
    overflow: 'hidden',
  },
  logdelmodalText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 20,
    color: '#000',
    fontWeight: '400',
    lineHeight: 24,
  },
  logdelmodalButtonContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
  },
  logdelmodalButton: {
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logdelmodalButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default DashboardScreen;
