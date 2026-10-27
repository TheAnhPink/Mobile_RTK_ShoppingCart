import React, { useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProducts } from '../slices/productSlice';
import {
  loadCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  applyDiscount,
  setShippingCost,
  selectCartSummary
} from '../slices/cartSlice';
import { RootState } from '../store';

export default function CartScreen() {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const productsStatus = useSelector((state: RootState) => state.products.status);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const summary = useSelector(selectCartSummary);

  useEffect(() => {
    const initializeApp = async () => {
      const savedCart = await AsyncStorage.getItem('cartItems');
      if (savedCart) {
        dispatch(loadCart(JSON.parse(savedCart)));
      }
      if (productsStatus === 'idle') {
        dispatch(fetchProducts() as any);
      }
    };
    initializeApp();
  }, [dispatch, productsStatus]);

  if (productsStatus === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (productsStatus === 'failed') {
    return (
      <View style={styles.center}>
        <Text>Lỗi tải dữ liệu sản phẩm!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🛍️ Cửa Hàng Trực Tuyến</Text>

      <Text style={styles.subtitle}>Sản Phẩm Có Sẵn</Text>
      {products.slice(0, 5).map(product => (
        <View key={product.id} style={styles.productCard}>
          <Text>{product.name.substring(0, 30)}...</Text>
          <Text>${product.price.toFixed(2)}</Text>
          <Button title="Thêm Vào Giỏ" onPress={() => dispatch(addToCart(product))} />
        </View>
      ))}

      <Text style={styles.subtitle}>Giỏ Hàng ({summary.itemCount} sản phẩm)</Text>
      {cartItems.length === 0 ? (
        <Text>Giỏ hàng trống</Text>
      ) : (
        cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <Text style={{ flex: 1 }}>{item.name.substring(0, 15)}...</Text>
            <View style={styles.quantityControl}>
              <Button title="-" onPress={() => dispatch(decreaseQuantity(item.id))} />
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <Button title="+" onPress={() => dispatch(increaseQuantity(item.id))} />
            </View>
            <Text style={{ width: 60, textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</Text>
            <Button title="Xóa" color="red" onPress={() => dispatch(removeFromCart(item.id))} />
          </View>
        ))
      )}

      <Text style={styles.subtitle}>Mã Giảm Giá</Text>
      <View style={styles.row}>
        <Button title="SUMMER10 (-10%)" onPress={() => dispatch(applyDiscount('SUMMER10'))} />
        <Button title="SPECIAL20 (-20%)" onPress={() => dispatch(applyDiscount('SPECIAL20'))} />
      </View>

      <Text style={styles.subtitle}>Phí Vận Chuyển</Text>
      <View style={styles.row}>
        <Button title="Miễn phí" onPress={() => dispatch(setShippingCost(0))} />
        <Button title="Tiêu chuẩn ($10)" onPress={() => dispatch(setShippingCost(10))} />
        <Button title="Nhanh ($25)" onPress={() => dispatch(setShippingCost(25))} />
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.subtitle}>Tóm Tắt Đơn Hàng</Text>
        <View style={styles.summaryRow}><Text>Tổng cộng:</Text><Text>${summary.subtotal.toFixed(2)}</Text></View>
        {summary.discount > 0 && (
          <View style={styles.summaryRow}><Text style={{ color: 'green' }}>Giảm giá:</Text><Text style={{ color: 'green' }}>-${summary.discount.toFixed(2)}</Text></View>
        )}
        <View style={styles.summaryRow}><Text>Thuế (10%):</Text><Text>${summary.tax.toFixed(2)}</Text></View>
        <View style={styles.summaryRow}><Text>Vận chuyển:</Text><Text>${summary.shipping.toFixed(2)}</Text></View>
        <View style={[styles.summaryRow, { borderTopWidth: 1, paddingTop: 10, marginTop: 10 }]}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Thành Tiền:</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>${summary.total.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  productCard: { padding: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 10, borderRadius: 5 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 10 },
  quantityText: { fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  summaryBox: { marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 50 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }
});