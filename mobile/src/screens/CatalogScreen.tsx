import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WorkflowHeader } from '../components/WorkflowHeader';
import type { CatalogResponse } from '../services/api';

interface CatalogScreenProps {
  catalog: CatalogResponse;
  onContinue: (catalog: CatalogResponse) => void;
  onBack: () => void;
}

export function CatalogScreen({ catalog, onContinue, onBack }: CatalogScreenProps) {
  const [draft, setDraft] = useState(catalog);
  const update = (key: keyof CatalogResponse, value: string) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <WorkflowHeader activeStep="catalog" />
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.kicker}>YOUR CATALOG</Text>
        <Text style={styles.title}>Here is what we understood.</Text>
        <Text style={styles.subtitle}>Review every detail. Your knowledge of the craft comes first.</Text>

        {draft.demoMode ? (
          <View style={styles.demoBadge}>
            <Text style={styles.demo}>DEMO MODE: catalog suggestions are editable examples.</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Product title</Text>
        <TextInput value={draft.title} onChangeText={(value) => update('title', value)} style={styles.input} />

        <View style={styles.twoCol}>
          <View style={styles.half}>
            <Text style={styles.label}>Category</Text>
            <TextInput value={draft.category} onChangeText={(value) => update('category', value)} style={styles.input} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Material</Text>
            <TextInput value={draft.material ?? ''} onChangeText={(value) => update('material', value)} style={styles.input} />
          </View>
        </View>

        <Text style={styles.label}>English description</Text>
        <TextInput multiline value={draft.descriptionEn} onChangeText={(value) => update('descriptionEn', value)} style={[styles.input, styles.textarea]} textAlignVertical="top" />

        <Text style={styles.label}>Hindi description</Text>
        <TextInput multiline value={draft.descriptionHi} onChangeText={(value) => update('descriptionHi', value)} style={[styles.input, styles.textarea]} textAlignVertical="top" />

        <TouchableOpacity style={styles.primaryButton} onPress={() => onContinue(draft)}>
          <Text style={styles.primaryText}>Continue to price</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F3EC' },
  content: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 50 },
  backButton: { paddingVertical: 8, alignSelf: 'flex-start' },
  backText: { color: '#53665A', fontSize: 15, fontWeight: '700' },
  kicker: { color: '#D96C45', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginTop: 18 },
  title: { color: '#263B35', fontSize: 29, lineHeight: 35, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#6F736D', fontSize: 15, lineHeight: 22, marginTop: 8 },
  demoBadge: { backgroundColor: '#F9ECE5', borderRadius: 8, padding: 8, marginTop: 12 },
  demo: { color: '#9A634F', fontSize: 12, fontWeight: '700' },
  label: { color: '#263B35', fontSize: 13, fontWeight: '800', marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#DED8CF', borderRadius: 11, minHeight: 46, paddingHorizontal: 12, color: '#263B35', fontSize: 14 },
  textarea: { minHeight: 88, paddingTop: 11 },
  twoCol: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  primaryButton: { backgroundColor: '#D96C45', minHeight: 56, borderRadius: 16, marginTop: 26, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryText: { color: '#FFF9F2', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFF9F2', fontSize: 25 },
});
