import { StyleSheet, Text, View } from 'react-native';
import type { WorkflowStep } from '../types';

const labels: WorkflowStep[] = ['photo', 'catalog', 'price', 'publish'];

interface WorkflowHeaderProps {
  activeStep: WorkflowStep;
}

export function WorkflowHeader({ activeStep }: WorkflowHeaderProps) {
  const activeIndex = labels.indexOf(activeStep);
  return (
    <View style={styles.container} accessibilityLabel={`Step ${activeIndex + 1} of 4`}>
      {labels.map((label, index) => (
        <View key={label} style={styles.item}>
          <View style={[styles.dot, index <= activeIndex && styles.activeDot]} />
          <Text style={[styles.label, index <= activeIndex && styles.activeLabel]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  item: { alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D3CEC5' },
  activeDot: { backgroundColor: '#D96C45' },
  label: { color: '#9A968D', fontSize: 11, textTransform: 'capitalize' },
  activeLabel: { color: '#53665A', fontWeight: '700' },
});
