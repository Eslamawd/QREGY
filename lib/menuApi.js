// src/lib/menuApi.js

import api from "../api/axiosClient";

/**
 * GET /api/menu
 */

// GET /api/menu/{id}
export async function getMenu(id) {
  const response = await api().get(`api/menus/${id}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}

/**
 * POST /api/menu
 * @param menuData: جسم الطلب بصيغة Menu (object)
 */
export async function addNewMenu(menuData) {
  const payload = new FormData();
  payload.append("name", menuData.name);
  payload.append("restaurant_id", menuData.restaurant_id);
  if (menuData.image instanceof File) {
    payload.append("image", menuData.image);
  }

  const response = await api().post("api/menus", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * PUT /api/menu/{id}
 * @param menuData: كائن الخدمة يحتوي على id وحقول أخرى محدثة
 */
export async function updateMenu(id, paylomenu) {
  const payload = new FormData();
  payload.append("name", paylomenu.name);
  payload.append("_method", "PATCH");
  if (paylomenu.image instanceof File) {
    payload.append("image", paylomenu.image);
  }

  const response = await api().post(`api/menus/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * DELETE /api/menu/{id}
 */
export async function deleteMenu(id) {
  const response = await api().delete(`api/menus/${id}`);
  return response.data;
}
