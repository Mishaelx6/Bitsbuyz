export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">bitsbuyz</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your premier destination for African-themed digital content. Discover inspiring books and videos featuring African people and culture.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-accent rounded-full flex items-center justify-center transition-colors duration-200">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-accent rounded-full flex items-center justify-center transition-colors duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-accent rounded-full flex items-center justify-center transition-colors duration-200">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-accent rounded-full flex items-center justify-center transition-colors duration-200">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-accent transition-colors duration-200">Home</a></li>
              <li><a href="/books" className="hover:text-accent transition-colors duration-200">Books</a></li>
              <li><a href="/videos" className="hover:text-accent transition-colors duration-200">Videos</a></li>
              <li><a href="/admin" className="hover:text-accent transition-colors duration-200">Admin</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 bitsbuyz. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
