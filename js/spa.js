
//פונקציה לניווט בין העמודים
function navigateTo(page) {
    const pages = document.querySelectorAll('.page'); // שמירת כל האלמנטים של page
    pages.forEach(p => p.style.display = 'none'); // הסתרת כל העמודים
    document.getElementById(page).style.display = 'block'; // הצגת העמוד הנבחר
}

// המתנה עד שייטען תוכן ה-DOM
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('home'); // דף ברירת מחדל

    window.navigateTo = navigateTo; // חשיפת הפונקציה לגלובל סקופ
});