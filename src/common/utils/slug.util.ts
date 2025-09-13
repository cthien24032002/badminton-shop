export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD') // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .replace(/[^a-z0-9\s-]/g, '') // loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // thay space bằng -
    .replace(/-+/g, '-'); // gộp nhiều dấu - liên tiếp

export const unslugify = (slug: string): string => {
  return slug
    .replace(/-/g, ' ') // đổi "-" thành khoảng trắng
    .replace(/\s+/g, ' ') // gộp khoảng trắng
    .trim()
    .toLowerCase(); // giữ thường toàn bộ
};

export const unslugifyAndCapitalizeWords = (slug: string): string => {
  return slug
    .toLowerCase()
    .replace(/-/g, ' ') // đổi dấu "-" thành khoảng trắng
    .replace(/\s+/g, ' ') // loại bỏ khoảng trắng thừa
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // viết hoa chữ cái đầu mỗi từ
};
