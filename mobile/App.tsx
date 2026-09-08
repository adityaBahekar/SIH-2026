import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { CreateProductScreen } from './src/screens/CreateProductScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ImageStudioScreen } from './src/screens/ImageStudioScreen';
import { PricingScreen } from './src/screens/PricingScreen';
import { PreviewScreen } from './src/screens/PreviewScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { generateCatalog, saveProduct, uploadImage, type CatalogResponse, type EnhancedImageResponse, type PricingResponse } from './src/services/api';
import type { DraftProduct } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'create' | 'studio' | 'catalog' | 'price' | 'preview' | 'products'>('home');
  const [draft, setDraft] = useState<DraftProduct | null>(null);
  const [image, setImage] = useState<EnhancedImageResponse | null>(null);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const resetAll = () => {
    setDraft(null);
    setImage(null);
    setCatalog(null);
    setPricing(null);
  };

  const handleStartCreate = () => {
    resetAll();
    setScreen('create');
  };

  const beginCatalog = async (nextDraft: DraftProduct): Promise<void> => {
    if (!nextDraft.imageUri) {
      Alert.alert('Add a photo', 'Please select or capture a product photo before continuing.');
      return;
    }
    setDraft(nextDraft);
    setUploading(true);
    try {
      const nextImage = await uploadImage(nextDraft.imageUri);
      setImage(nextImage);
      setScreen('studio');
    } catch (error) {
      Alert.alert('Photo upload failed', error instanceof Error ? error.message : 'Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const beginCatalogGeneration = async (): Promise<void> => {
    if (!draft || !image) return;
    setGenerating(true);
    try {
      const nextCatalog = await generateCatalog(image.enhancedUrl, draft.description);
      setCatalog(nextCatalog);
      setScreen('catalog');
    } catch (error) {
      Alert.alert('Catalog unavailable', error instanceof Error ? error.message : 'You can enter the details manually.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'home' ? (
        <HomeScreen onCreateProduct={handleStartCreate} onViewProducts={() => setScreen('products')} />
      ) : screen === 'create' ? (
        <CreateProductScreen
          onBack={() => setScreen('home')}
          onContinue={beginCatalog}
          loading={uploading}
        />
      ) : screen === 'studio' && draft && image ? (
        <ImageStudioScreen
          imageUri={draft.imageUri ?? image.originalUrl}
          enhancedUri={image.enhancedUrl}
          demoMode={image.demoMode}
          onBack={() => setScreen('create')}
          onUseImage={beginCatalogGeneration}
          loading={generating}
        />
      ) : screen === 'catalog' && catalog ? (
        <CatalogScreen
          catalog={catalog}
          onContinue={(nextCatalog) => {
            setCatalog(nextCatalog);
            setScreen('price');
          }}
          onBack={() => setScreen('studio')}
        />
      ) : screen === 'price' && catalog ? (
        <PricingScreen
          category={catalog.category}
          onBack={() => setScreen('catalog')}
          onContinue={(nextPricing) => {
            setPricing(nextPricing);
            setScreen('preview');
          }}
        />
      ) : screen === 'preview' && catalog && image && pricing ? (
        <PreviewScreen
          catalog={catalog}
          image={image}
          pricing={pricing}
          saving={saving}
          onBack={() => setScreen('price')}
          onSave={async () => {
            setSaving(true);
            try {
              await saveProduct({
                ...catalog,
                imageOriginalUrl: image.originalUrl,
                imageEnhancedUrl: image.enhancedUrl,
                imagePublicId: image.publicId,
                ...pricing,
                pricingExplanation: pricing.explanation,
                status: 'draft',
              });
              Alert.alert('Product saved', 'Your product has been saved successfully in your catalog.');
              resetAll();
              setScreen('products');
            } catch (error) {
              Alert.alert('Could not save product', error instanceof Error ? error.message : 'Please try again.');
            } finally {
              setSaving(false);
            }
          }}
        />
      ) : screen === 'products' ? (
        <ProductsScreen onBack={() => setScreen('home')} />
      ) : null}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EC',
  },
});
