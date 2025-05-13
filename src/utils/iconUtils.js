import {
  Home,
  Users,
  UserCircle,
  Calendar,
  Building,
  Menu,
  X,
  LogOut,
  User,
  Sun,
  Moon,
  ChevronDown,
  AlertCircle,
  Check,
  Plus,
  Trash,
  Edit,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText
} from 'lucide-react';

// Map of icon names to their components
const iconMap = {
  Home, Users, UserCircle, Calendar, Building, Menu, X, LogOut, User,
  Sun, Moon, ChevronDown, AlertCircle, Check, Plus, Trash, Edit,
  ArrowLeft, ChevronLeft, ChevronRight, Filter, Search, Mail, Phone,
  MapPin, Clock, FileText
};

export default (name) => iconMap[name] || User; // Default to User if icon not found