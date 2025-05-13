import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Define all icons
const Users = getIcon('Users');
const BarChart = getIcon('BarChart');
const Calendar = getIcon('Calendar');
const Briefcase = getIcon('Briefcase');
const Bell = getIcon('Bell');
const User = getIcon('User');
const Settings = getIcon('Settings');
const Menu = getIcon('Menu');
const X = getIcon('X');

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [onLeaveFilter, setOnLeaveFilter] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    toast.success(`Navigated to ${section.charAt(0).toUpperCase() + section.slice(1)}`, {
      icon: "🔄"
    });
  };

  // Handler for "On Leave" card click
  const onLeaveClick = () => {
    setActiveSection('employees');
    setOnLeaveFilter(true);
    toast.info('Showing employees currently on leave', {
      icon: "🔍"
    });
  };

  // Mock data for stats
  const statsData = [
    { title: "Total Employees", value: 248, icon: Users, color: "bg-blue-500" },
    { title: "Departments", value: 12, icon: Briefcase, color: "bg-purple-500" },
    { title: "New Hires", value: 18, icon: User, color: "bg-green-500" },
    { title: "On Leave", value: 7, icon: Calendar, color: "bg-amber-500", onClick: onLeaveClick },
    { title: "On Leave", value: 7, icon: Calendar, color: "bg-amber-500" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`hidden md:flex flex-col w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            StaffSync
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {[
            { name: "Dashboard", icon: BarChart, id: "dashboard" },
            { name: "Employees", icon: Users, id: "employees" },
            { name: "Attendance", icon: Calendar, id: "attendance" },
            { name: "Departments", icon: Briefcase, id: "departments" },
            { name: "Notifications", icon: Bell, id: "notifications" },
            { name: "Settings", icon: Settings, id: "settings" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex items-center w-full p-3 space-x-3 rounded-xl transition-all duration-200
                ${activeSection === item.id 
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                  : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {activeSection === item.id && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="w-1 h-full bg-primary absolute right-0 rounded-l-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile menu */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-surface-800 md:hidden overflow-y-auto"
      >
        <div className="p-4 flex justify-between items-center border-b border-surface-200 dark:border-surface-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            StaffSync
          </h1>
          <button onClick={toggleMobileMenu} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {[
            { name: "Dashboard", icon: BarChart, id: "dashboard" },
            { name: "Employees", icon: Users, id: "employees" },
            { name: "Attendance", icon: Calendar, id: "attendance" },
            { name: "Departments", icon: Briefcase, id: "departments" },
            { name: "Notifications", icon: Bell, id: "notifications" },
            { name: "Settings", icon: Settings, id: "settings" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex items-center w-full p-3 space-x-3 rounded-xl transition-all duration-200
                ${activeSection === item.id 
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                  : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-surface-50 dark:bg-surface-900">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700 h-16 flex items-center px-4 sm:px-6">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-4 md:ml-0">
            <h2 className="text-xl font-semibold">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden sm:flex items-center px-3 py-2 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <span className="text-sm font-medium">Welcome, Admin</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`card-neu flex items-center ${stat.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                    onClick={stat.onClick}
                  >
                    <div 
                      className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white ${
                        stat.onClick 
                          ? 'group-hover:scale-105 transition-transform' 
                          : ''
                      }`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{stat.value}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{stat.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Feature */}
              <MainFeature />
            </motion.div>
          )}

          {/* Placeholder content for other sections */}
          {activeSection !== 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              key={activeSection}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-neu flex items-center justify-center h-64"
            >
              <p className="text-lg">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content coming soon...
              </p>
              {activeSection === 'employees' && (
                <div className="mt-8">
                  <MainFeature initialStatus={onLeaveFilter ? 'on leave' : 'All Statuses'} />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}