<script setup>
</script>

<template>
  <div class="d-flex justify-content-between mb-5">
    <h1 class="m-0"><a href="/" class="text-decoration-none">NVN</a></h1>
    <div class="d-flex">
      <div class="me-3 d-flex align-items-center">
        <i class="bi bi-circle-half p-2 me-2 cursor-pointer" id="dark-mode-switch"></i>
        <select name="lang" id="lang-select" class="form-select">
          <option value="en" selected>EN</option>
          <option value="vi">VI</option>
        </select>
      </div>
      <div class="d-flex flex-column justify-content-center d-none" id="header-user-info">
        <div>
          <span class="badge bg-primary" id="header-user-username"></span>
          <span class="badge bg-info d-none" id="header-admin-label">Admin</span>
        </div>
        <button type="button" class="btn btn-link p-0" id="logout-btn">Log Out</button>
      </div>
      <button type="button" class="btn btn-link p-0" id="login-btn">Log In</button>
    </div>
  </div>
</template>