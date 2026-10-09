'use client';

import React, { useState } from 'react';
import { Apartment } from '@/types/property';
import { TOWERS } from '@/data/development';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Building,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';

interface EnquiryDialogProps {
  apartment: Apartment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryDialog({ apartment, isOpen, onClose }: EnquiryDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-10-18');
  const [preferredTime, setPreferredTime] = useState('Sunset Champagne Viewing (5:30 PM)');
  const [consultationType, setConsultationType] = useState('Private Gallery Walkthrough');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  if (!isOpen) return null;

  const tower = apartment ? TOWERS.find((t) => t.id === apartment.towerId) : null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please provide your full name';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Please provide a valid phone number (minimum 8 digits)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate brief processing
    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmationCode(`AUR-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsConfirmed(true);
    }, 900);
  };

  const handleClose = () => {
    setIsConfirmed(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn p-4 select-none">
      <div className="relative w-full max-w-lg bg-[#0e0f14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-aurel-ivory">
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-aurel-gold/15 border border-aurel-gold/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-aurel-gold" />
            </div>
            <div>
              <h2 className="font-serif text-base font-semibold text-white tracking-wide">
                Schedule Private Viewing
              </h2>
              <p className="text-xs text-white/50">
                {apartment
                  ? `Residence ${apartment.unitNumber} • ${tower?.name}`
                  : 'AUREL Residences Master Gallery'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {isConfirmed ? (
            /* CONFIRMATION STATE */
            <div className="flex flex-col items-center text-center py-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-aurel-gold font-semibold">
                Invitation Reserved
              </span>
              <h3 className="font-serif text-xl font-bold text-white mt-1 mb-2">
                Viewing Request Confirmed
              </h3>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 my-4 w-full text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Reference Code:</span>
                  <span className="font-mono text-aurel-gold font-bold">{confirmationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Client:</span>
                  <span className="text-white">{name}</span>
                </div>
                {apartment && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Property:</span>
                    <span className="text-white">
                      Residence {apartment.unitNumber} ({apartment.type})
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/40">Session:</span>
                  <span className="text-white">{preferredDate} • {preferredTime}</span>
                </div>
              </div>

              <p className="text-xs text-white/60 leading-relaxed mb-6 max-w-sm">
                A dedicated private client advisor from Studio Aurel will reach out to you shortly at{' '}
                <span className="text-white font-mono">{phone}</span> to coordinate your private reception and gate credentials.
              </p>

              <div className="text-[10px] text-white/40 mb-6 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                *Demo Simulation Notice: No private data has been stored or transmitted to external servers.
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-aurel-gold text-aurel-dark font-semibold text-xs uppercase tracking-wider transition-all hover:bg-aurel-gold-light"
              >
                Return to Experience
              </button>
            </div>
          ) : (
            /* ENQUIRY FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Apartment Banner */}
              {apartment && (
                <div className="p-3 rounded-xl bg-aurel-gold/10 border border-aurel-gold/25 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-aurel-gold font-medium font-serif">
                      Residence {apartment.unitNumber} ({apartment.type})
                    </span>
                    <span className="block text-[11px] text-white/60">
                      Floor {apartment.floorNumber} • {apartment.carpetAreaSqFt} sq.ft. • {apartment.indicativePrice}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-aurel-gold border border-aurel-gold/30">
                    Selected
                  </span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-medium">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Sterling Alexander"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/20 focus:outline-none focus:border-aurel-gold transition-colors ${
                      errors.name ? 'border-red-500/80' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-medium">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@domain.com"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/20 focus:outline-none focus:border-aurel-gold transition-colors ${
                        errors.email ? 'border-red-500/80' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-medium">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 382-9901"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/20 focus:outline-none focus:border-aurel-gold transition-colors ${
                        errors.phone ? 'border-red-500/80' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-medium">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-aurel-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-medium">
                    Preferred Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#14151b] border border-white/10 text-xs text-white focus:outline-none focus:border-aurel-gold transition-colors"
                  >
                    <option>Morning (10:30 AM)</option>
                    <option>Early Afternoon (2:00 PM)</option>
                    <option>Sunset Champagne Viewing (5:30 PM)</option>
                    <option>Twilight Illuminated (7:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-medium">
                  Consultation Experience
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Private Gallery Walkthrough', 'Virtual 3D Consultation'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConsultationType(type)}
                      className={`p-2.5 rounded-xl border transition-all text-center ${
                        consultationType === type
                          ? 'bg-aurel-gold/20 border-aurel-gold text-white font-medium'
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-aurel-gold via-aurel-gold-light to-aurel-gold text-aurel-dark font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-aurel-gold/30 flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-aurel-dark border-t-transparent rounded-full animate-spin" />
                      <span>Reserving Private Slot...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm Invitation Request</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-white/40 mt-2">
                  *Illustrative simulation. No sensitive data is stored or transmitted.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
