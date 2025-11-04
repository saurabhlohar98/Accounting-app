/** @format */

import Ledger from "../models/ledgerModel.js";

export const createLedger = async (req, res) => {
  try {
    const ledger = await Ledger.create(req.body);
    res.status(201).json(ledger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.findAll();
    res.json(ledgers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLedgerById = async (req, res) => {
  try {
    const ledger = await Ledger.findByPk(req.params.id);
    if (!ledger) return res.status(404).json({ message: "Ledger not found" });
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLedger = async (req, res) => {
  try {
    const ledger = await Ledger.findByPk(req.params.id);
    if (!ledger) return res.status(404).json({ message: "Ledger not found" });
    await ledger.update(req.body);
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLedger = async (req, res) => {
  try {
    const ledger = await Ledger.findByPk(req.params.id);
    if (!ledger) return res.status(404).json({ message: "Ledger not found" });
    await ledger.destroy();
    res.json({ message: "Ledger deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
