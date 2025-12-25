import React, {useEffect, useMemo, useState} from 'react';
import {
  deleteMetaDataForImnt,
  fetchEntireMetaData,
  postMetaDataForImnt
} from './../../../services/MarketMetaDataService';
import './MarketMetadataManager.css';
import {Instrument, Portfolio} from "../../../assets/proto/generated/MarketData.ts";
import {DataPacket} from "../../../assets/proto/generated/DataPacket.ts";

// Backend Keys
const KEY_CCY = "ccy";
const KEY_MER = "mer";
const KEY_NOTES = "notes";
const KEY_SIGNAL = "signal";
const KEY_ISSUE_COUNTRY = "issue-country";
const KEY_ORIGIN_COUNTRY = "origin-country";
const KEY_SECTOR = "sector";
const KEY_DIV_YIELD = "div-yield";
const KEY_IMNT_TYPE = "imnt-type";
const KEY_NAME = "name";

export enum MetadataSortIndex {
  SYMBOL, NAME, SECTOR, TYPE, SIGNAL, MER, YIELD, CCY, ISSUE, ORIGIN, NOTES
}

const SIGNALS = ['SIG_HOLD', 'SIG_BUY', 'SIG_STRONG_BUY', 'SIG_SELL', 'SIG_STRONG_SELL'];
const COUNTRIES = ['CA', 'IN', 'US', 'GLOBAL'];
const CURRENCIES = ['CAD', 'INR', 'USD'];
const INST_TYPES = ['EQUITY', 'INDEX', 'ETF', 'MUTUALFUND', 'FUTURE', 'CURRENCY', 'CRYPTOCURRENCY', 'OPTION'];

const MarketMetaDataManager: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: MetadataSortIndex; direction: 'asc' | 'desc' }>({
    key: MetadataSortIndex.SYMBOL,
    direction: 'asc'
  });
  const [editData, setEditData] = useState<any>(null);
  const [isNewMode, setIsNewMode] = useState(false);
  const [deleteSymbol, setDeleteSymbol] = useState('');

  useEffect(() => {
    loadAllMetadata();
  }, []);

  const loadAllMetadata = async () => {
    try {
      const data = await fetchEntireMetaData();
      const binaryData = new Uint8Array(data);
      const portfolio: Portfolio = Portfolio.deserializeBinary(binaryData);
      setInstruments(portfolio.instruments || []);
    } catch (e) {
      console.error("Load error:", e);
    }
  };

  const getValueToSort = (inst: Instrument, key: MetadataSortIndex) => {
    switch (key) {
      case MetadataSortIndex.SYMBOL:
        return inst.ticker?.symbol || '';
      case MetadataSortIndex.NAME:
        return inst.ticker?.name || '';
      case MetadataSortIndex.SECTOR:
        return inst.ticker?.sector || '';
      case MetadataSortIndex.SIGNAL:
        return inst.signal || 0;
      case MetadataSortIndex.MER:
        return inst.mer || 0;
      case MetadataSortIndex.YIELD:
        return inst.dividendYield || 0;
      case MetadataSortIndex.CCY:
        return inst.ccy || 0;
      case MetadataSortIndex.ISSUE:
        return inst.issueCountry || 0;
      case MetadataSortIndex.ORIGIN:
        return inst.originCountry || 0;
      case MetadataSortIndex.NOTES:
        return inst.notes || '';
      case MetadataSortIndex.TYPE:
        return inst.ticker?.type || '';
      default:
        return '';
    }
  };

  const sortedInstruments = useMemo(() => {
    const items = [...instruments];
    items.sort((a, b) => {
      const aV = getValueToSort(a, sortConfig.key);
      const bV = getValueToSort(b, sortConfig.key);
      if (aV < bV) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aV > bV) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return items;
  }, [instruments, sortConfig]);

  const requestSort = (key: MetadataSortIndex) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({key, direction});
  };

  const handleNewInstrument = () => {
    setIsNewMode(true);
    setEditData({
      ticker: {symbol: '', name: '', sector: '', type: 0},
      mer: 0,
      dividendYield: 0,
      signal: 0,
      ccy: 0,
      issueCountry: 0,
      originCountry: 0,
      notes: ''
    });
  }

  const handleSaveUpdate = async () => {
    if (!editData?.ticker?.symbol) return;
    try {
      const kvMap = new Map<string, string>();
      const setIf = (k: string, v: string) => {
        if (!v || v.toString() === "0") return "";
        kvMap.set(k, v.toString());
      };

      setIf(KEY_CCY, CURRENCIES[editData.ccy]);
      setIf(KEY_MER, editData.mer);
      setIf(KEY_NOTES, editData.notes);
      setIf(KEY_SIGNAL, SIGNALS[editData.signal]);
      setIf(KEY_ISSUE_COUNTRY, COUNTRIES[editData.issueCountry]);
      setIf(KEY_ORIGIN_COUNTRY, COUNTRIES[editData.originCountry]);
      setIf(KEY_SECTOR, editData.ticker?.sector);
      setIf(KEY_DIV_YIELD, editData.dividendYield);
      setIf(KEY_IMNT_TYPE, INST_TYPES[editData.ticker?.type]);
      setIf(KEY_NAME, editData.ticker?.name);

      const dataPacket = new DataPacket();
      dataPacket.stringStringMap = kvMap;

      await postMetaDataForImnt(editData.ticker.symbol, dataPacket);
      await loadAllMetadata();

      handleNewInstrument();
    } catch (e) {
      alert("Persistence Error");
    }
  };

  return (
    <div className="workshop-container">
      <header className="workshop-header">
        <div className="brand">
          <h1>MARKET METADATA</h1>
          <span className="node-status">Live Protocol Connected</span>
        </div>
        <button className="btn-add" onClick={handleNewInstrument}>+ NEW INSTRUMENT
        </button>
      </header>

      <main className="workshop-grid">
        {/* LEFT COLUMN: TABLE */}
        <section className="glass-card table-section">
          <div className="scroll-area">
            <table className="imnt-table">
              <thead>
              <tr>
                {[
                  {label: 'Symbol', key: MetadataSortIndex.SYMBOL},
                  {label: 'Name', key: MetadataSortIndex.NAME},
                  {label: 'Sector', key: MetadataSortIndex.SECTOR},
                  {label: 'Type', key: MetadataSortIndex.TYPE},
                  {label: 'Signal', key: MetadataSortIndex.SIGNAL},
                  {label: 'MER%', key: MetadataSortIndex.MER},
                  {label: 'Yield%', key: MetadataSortIndex.YIELD},
                  {label: 'CCY', key: MetadataSortIndex.CCY},
                  {label: 'Issue', key: MetadataSortIndex.ISSUE},
                  {label: 'Origin', key: MetadataSortIndex.ORIGIN},
                  {label: 'Notes', key: MetadataSortIndex.NOTES},
                ].map(col => (
                  <th key={col.key} onClick={() => requestSort(col.key)}>
                    {col.label} {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? '▴' : '▾') : '⋄'}
                  </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {sortedInstruments.map((inst, i) => (
                <tr key={i}
                    onClick={() => {
                      setEditData(inst.toObject());
                      setIsNewMode(false);
                    }}
                    className={editData?.ticker?.symbol === inst.ticker?.symbol ? 'active-row' : ''}>
                  <td style={{color: 'var(--accent)', fontWeight: 700}}>{inst.ticker?.symbol}</td>
                  <td>{inst.ticker?.name}</td>
                  <td style={{color: 'var(--text-dim)'}}>{inst.ticker?.sector}</td>
                  <td style={{color: 'var(--text-dim)'}}>{INST_TYPES[inst.ticker?.type ?? 0]}</td>
                  <td>
                        <span className={`sig-badge s-${inst.signal}`}>
                            {SIGNALS[inst.signal ?? 0].replace('SIG_', '')}
                        </span>
                  </td>
                  <td>{inst.mer?.toFixed(2)}%</td>
                  <td>{inst.dividendYield?.toFixed(2)}%</td>
                  <td>{CURRENCIES[inst.ccy ?? 0]}</td>
                  <td>{COUNTRIES[inst.issueCountry ?? 0]}</td>
                  <td>{COUNTRIES[inst.originCountry ?? 0]}</td>
                  <td>{inst.notes}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT COLUMN: EDITOR & TOOLS */}
        <aside className="right-sidebar">
          <div className="glass-card editor-card">
            <div className="card-header">
              <h3>{isNewMode ? "INITIALIZE ENTRY" : `EDITOR // ${editData?.ticker?.symbol || 'IDLE'}`}</h3>
            </div>

            {editData ? (
              <form className="form-content" onSubmit={(e) => {
                e.preventDefault();
                handleSaveUpdate();
              }}>
                <div className="form-section">
                  <div className="form-row">
                    <div className="input-group">
                      <label>SYMBOL</label>
                      <input value={editData.ticker?.symbol} readOnly={!isNewMode}
                             className={!isNewMode ? 'locked' : ''}
                             onChange={e => setEditData({
                               ...editData,
                               ticker: {...editData.ticker, symbol: e.target.value.toUpperCase()}
                             })}/>
                    </div>
                    <div className="input-group">
                      <label>ASSET TYPE</label>
                      <select value={editData.ticker?.type} onChange={e => setEditData({
                        ...editData,
                        ticker: {...editData.ticker, type: +e.target.value}
                      })}>
                        {INST_TYPES.map((t, i) => <option key={i} value={i}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="input-group" style={{marginTop: '1rem'}}>
                    <label>SECTOR</label>
                    <input value={editData.ticker?.sector} onChange={e => setEditData({
                      ...editData,
                      ticker: {...editData.ticker, sector: e.target.value}
                    })}/>
                  </div>

                  <div className="input-group" style={{marginTop: '1rem'}}>
                    <label>INSTRUMENT NAME</label>
                    <input value={editData.ticker?.name} onChange={e => setEditData({
                      ...editData,
                      ticker: {...editData.ticker, name: e.target.value}
                    })}/>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-row">
                    <div className="input-group">
                      <label>MER %</label>
                      <input type="number" step="0.01" value={editData.mer}
                             onChange={e => setEditData({...editData, mer: +e.target.value})}/>
                    </div>
                    <div className="input-group">
                      <label>YIELD %</label>
                      <input type="number" step="0.01" value={editData.dividendYield}
                             onChange={e => setEditData({...editData, dividendYield: +e.target.value})}/>
                    </div>
                  </div>
                  <div className="input-group" style={{marginTop: '1rem'}}>
                    <label>TRADING SIGNAL</label>
                    <select value={editData.signal} onChange={e => setEditData({...editData, signal: +e.target.value})}>
                      {SIGNALS.map((s, i) => <option key={i} value={i}>{s}</option>)}
                    </select>
                  </div>
                </div>


                <div className="form-section">
                  <div className="form-row">
                    <div className="input-group">
                      <label>CURRENCY</label>
                      <select value={editData.ccy} onChange={e => setEditData({...editData, ccy: +e.target.value})}>
                        {CURRENCIES.map((c, i) => <option key={i} value={i}>{c}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>ISSUE COUNTRY</label>
                      <select value={editData.issueCountry}
                              onChange={e => setEditData({...editData, issueCountry: +e.target.value})}>
                        {COUNTRIES.map((c, i) => <option key={i} value={i}>{c}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>ORIGIN</label>
                      <select value={editData.originCountry}
                              onChange={e => setEditData({...editData, originCountry: +e.target.value})}>
                        {COUNTRIES.map((c, i) => <option key={i} value={i}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="input-group">
                    <label>ENGINEER NOTES</label>
                    <textarea rows={3} value={editData.notes}
                              onChange={e => setEditData({...editData, notes: e.target.value})}/>
                  </div>
                </div>

                <button className="btn-save">
                  {isNewMode ? 'COMMIT NEW INSTRUMENT' : 'PUSH METADATA UPDATE'}
                </button>
              </form>
            ) : (
              <div className="form-content"
                   style={{textAlign: 'center', color: 'var(--text-dim)', padding: '4rem 1rem'}}>
                <p>Select an instrument from the terminal to begin editing.</p>
              </div>
            )}
          </div>

          <div className="glass-card danger-zone">
            <h3 className="danger-text">SCRUB METADATA</h3>
            <form className="delete-controls" onSubmit={async (e) => {
              e.preventDefault();
              if (!deleteSymbol) return;
              if (confirm(`Permanently delete ${deleteSymbol}?`)) {
                await deleteMetaDataForImnt(deleteSymbol);
                setDeleteSymbol('');
                loadAllMetadata();
              }
            }}>
              <input placeholder="SYMBOL" value={deleteSymbol}
                     onChange={e => setDeleteSymbol(e.target.value.toUpperCase())}/>
              <button type="submit" className="btn-delete">DELETE</button>
            </form>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default MarketMetaDataManager;