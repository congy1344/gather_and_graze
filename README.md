# Gather & Graze

Ứng dụng React SPA giúp người nấu tại nhà tìm công thức, lưu món yêu thích và lên lịch bữa ăn trong tuần. Dự án được xây dựng như một case study frontend/UX cho portfolio intern: phạm vi nhỏ, luồng chính hoàn chỉnh và các quyết định sản phẩm có thể giải thích được.

**Public demo:** chưa xuất bản. Deployment Vercel hiện bật bảo vệ đăng nhập; xem hướng dẫn chạy local bên dưới.

> Bản deploy dùng dữ liệu mẫu và lưu lựa chọn ngay trong trình duyệt; không có tài khoản hay backend.

## Bài toán và người dùng

Người dùng mục tiêu là người tự nấu ăn, muốn quyết định “hôm nay ăn gì” nhanh hơn và gom các lựa chọn trong tuần vào một nơi. Sản phẩm ưu tiên ba tác vụ:

1. Tìm món theo từ khóa, danh mục và thời gian chuẩn bị.
2. Đọc công thức, đổi số khẩu phần và đánh dấu từng bước đã làm.
3. Thêm, thay thế hoặc xóa món trong lịch tuần với phản hồi rõ ràng và khả năng hoàn tác.

## Luồng chính

- **Khám phá:** trang chủ → bộ sưu tập → tìm/lọc/sắp xếp → chi tiết công thức.
- **Nấu ăn:** chi tiết → điều chỉnh khẩu phần → theo dõi các bước.
- **Lập kế hoạch:** chi tiết hoặc Meal Planner → chọn ngày → thêm/thay món → hoàn tác nếu cần.
- **Quay lại:** lưu món yêu thích, lịch tuần, ngôn ngữ và theme bằng `localStorage`.

## Quyết định thiết kế

- Nội dung công thức có bản tiếng Việt và tiếng Anh thay vì chỉ dịch lớp giao diện.
- Card chỉ hiển thị dữ liệu có thật trong mock data; không dùng rating hoặc số liệu giả để “làm đầy” giao diện.
- Hành động làm thay đổi lịch tuần có trạng thái phản hồi, phân biệt thêm/thay/xóa và hỗ trợ undo.
- Visual hierarchy tập trung vào tên món, thời gian và CTA chính; giảm badge, gradient và các khối trang trí thường làm UI trông như template AI.
- Navigation, modal và điều khiển tương tác có nhãn truy cập bàn phím; giao diện tôn trọng `prefers-reduced-motion`.

## Trade-offs và giới hạn

- Dữ liệu chỉ là 12 công thức mẫu, không đồng bộ giữa thiết bị và sẽ mất khi xóa storage của trình duyệt.
- Không có đăng nhập, backend, giỏ nguyên liệu hoặc tính toán dinh dưỡng.
- Unit test hiện tập trung vào logic thuần của tìm kiếm/lọc và meal plan. Chưa có integration test trên trình duyệt hoặc kiểm thử trực quan tự động.
- Ảnh món ăn dùng URL bên ngoài, nên cần mạng để hiển thị đầy đủ.

## Kiến trúc

```text
src/
├─ components/       UI dùng lại: layout, modal, filter, recipe card
├─ context/          dữ liệu ứng dụng và tùy chọn giao diện
├─ data/             công thức mẫu và bản dịch
├─ hooks/            localStorage, debounce và filter
├─ pages/            các route cấp trang
├─ styles/           design tokens và responsive CSS
└─ utils/            logic thuần có thể unit test
```

Stack: React 18, React Router 7, Vite 8, Context API, CSS thuần, ESLint và Node test runner. Không dùng UI framework hoặc thư viện state bên ngoài.

## Chạy local

Yêu cầu Node.js `20.19+` và npm.

```bash
git clone https://github.com/congy1344/HuynhCongY-Demo-UXUI.git
cd HuynhCongY-Demo-UXUI
npm ci
npm run dev
```

Vite sẽ in địa chỉ local trong terminal, mặc định là `http://localhost:5173`.

## Kiểm tra chất lượng

```bash
npm test
npm run lint
npm run build
npm audit
```

GitHub Actions chạy bốn gate đầu tiên (`npm ci`, test, lint, build) trên mỗi push và pull request. Muốn đặt lại dữ liệu demo, xóa các key bắt đầu bằng `gather:` trong `localStorage`.
