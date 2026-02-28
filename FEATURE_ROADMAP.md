# Feature Roadmap - Web Application Implementation

Based on dissertation analysis (2021 Master's Thesis)

## 📋 Current Status

### ✅ Implemented
- [x] Dynkin diagram basic rendering
- [x] Tensor product calculations
- [x] Group creation API
- [x] Basic group information (rank, dimension, Cartan matrix)
- [x] Simple roots and positive roots

### ❌ Missing (High Priority - Core Dissertation Features)

## Phase 1: Symmetry Breaking (Section 3.4-3.5)

**Priority:** CRITICAL - This is a flagship feature in your dissertation

### Backend Tasks
- [ ] Implement `break_symmetry()` algorithm in core
  - [ ] Standard method (eliminate node from Dynkin diagram)
  - [ ] Extended method (eliminate node from extended algebra)
  - [ ] Return broken group list with U(1) factors
- [ ] API endpoint: `POST /groups/{id}/break-symmetry` (currently returns 501)
- [ ] Compute gamma (highest root) for extended algebras
- [ ] Generate broken Dynkin diagram data

### Frontend Tasks
- [ ] Create `SymmetryBreaker.tsx` component
  - [ ] Interactive Dynkin diagram with clickable nodes
  - [ ] Toggle between standard/extended breaking
  - [ ] Display resulting groups (e.g., "SO(10) → SU(5) ⊗ U(1)")
  - [ ] Show crossed-node Dynkin diagram (like Fig 3.11, 3.12)
- [ ] Integrate with Calculator page
- [ ] Add examples: SO(10)→SU(5), SU(5)→SU(3)⊗SU(2)

**Reference Figures:** 3.11, 3.12, 3.13, 3.14, 3.15

---

## Phase 2: Irrep Visualization

### 2.1 Hasse Diagrams (Section 3.2.1)

**Shows irrep construction step-by-step**

#### Backend
- [ ] Compute weight system with construction path
- [ ] Return `links` data (from_weight → to_weight via simple_root)
- [ ] Return `levels` (distance from highest weight)
- [ ] Endpoint: `GET /irreps/{id}/hasse-diagram`

#### Frontend
- [ ] Create `HasseDiagram.tsx` component
  - [ ] D3.js tree/graph layout
  - [ ] Nodes show Dynkin labels
  - [ ] Edges labeled with simple root used (α₀, α₁, ...)
  - [ ] Color-code levels
  - [ ] Show multiplicities on nodes
- [ ] Modal or dedicated view

**Reference Figures:** 3.6 (15 of SU(4)), 3.7 (3 of SU(3))

**Example from dissertation code:**
```python
>>> irp = so10.irrep([0,0,0,1,0])
>>> irp.links()  # Returns construction path
>>> irp.levels() # Returns step count from max weight
```

### 2.2 Multiplet Diagrams - 2D (Section 3.6)

**Quantum number space visualization**

#### Backend
- [ ] Compute quantum numbers from weights
- [ ] Load Euclidean space vectors for root vectors
- [ ] Endpoint: `GET /irreps/{id}/multiplet-2d`

#### Frontend
- [ ] Create `MultipletDiagram2D.tsx` component
  - [ ] D3.js scatter plot
  - [ ] Axes represent quantum numbers (e.g., I₃, Y for SU(3))
  - [ ] Point size = multiplicity
  - [ ] Hover shows Dynkin label
  - [ ] Connect points that differ by one simple root
  - [ ] Color subgroups when symmetry broken

**Reference Figures:** 3.16 (3 of SU(3)), 3.17 (3̄ of SU(3)), 3.18 (8 of SU(3))

### 2.3 Multiplet Diagrams - 3D (Section 3.6)

**For rank-3+ algebras**

#### Frontend
- [ ] Create `MultipletDiagram3D.tsx` component
  - [ ] Use `@react-three/fiber` + `@react-three/drei`
  - [ ] 3D scatter plot with Three.js
  - [ ] Interactive camera controls (orbit)
  - [ ] Highlight symmetry planes (broken subgroups)
  - [ ] Legend for axes (e.g., I₃, Y, T₃ for SU(4))

**Reference Figure:** 3.19 (15 of SU(4))

---

## Phase 3: Advanced Calculations

### 3.1 Find Irrep Labels by Dimension (Section 3.3)

**Search for irreps of a given dimension**

#### Backend
- [ ] Implement search algorithm
  - [ ] Generate candidates up to some max weight
  - [ ] Use Weyl dimension formula to filter
  - [ ] Return all Dynkin labels matching dimension
- [ ] Endpoint: `GET /irreps/search?group={group}&dimension={dim}`
- [ ] Add range search: `dimension_min` and `dimension_max`

#### Frontend
- [ ] Create `IrrepFinder.tsx` component
  - [ ] Input: group + dimension
  - [ ] Display table of results
    - Columns: Dynkin Labels, Dimension, Index, Congruency, Name
  - [ ] Click row to view irrep details
  - [ ] Show example: "All irreps of dimension 20 in SU(4)"

**Dissertation example (Section 3.3.3):**
> Five different SU(4) irreps have dimension 20:
> - (0,2,0), (1,1,0), (0,1,1), (3,0,0), (0,0,3)
> Distinguished by index and congruency class

### 3.2 Irrep Properties Calculator

#### Backend
- [ ] Implement index calculation (Section 3.3.3)
- [ ] Implement congruency number (different formula per Cartan type)
- [ ] Check if irrep is self-conjugate
- [ ] Compute conjugate irrep labels

#### Frontend  
- [ ] Show irrep metadata card:
  - Dimension
  - Index
  - Congruency class
  - LaTeX name (with primes: 20, 2̄0, 20', 20'')
  - Is self-conjugate?
  - Conjugate representation

### 3.3 Multiplicity Calculator (Section 3.2.2)

**Two methods documented**

#### Backend
- [ ] Implement Freudenthal's formula (recursive)
- [ ] Implement Weyl group method (faster)
- [ ] Return multiplicity for each weight in irrep

---

## Phase 4: Symmetry Breaking on Irreps (Section 3.5.3)

**Show how irreps decompose under breaking**

### Backend
- [ ] Implement `irrep.breakSym(node_index)`
- [ ] Return list of (subalgebra_irrep, hypercharge) tuples
- [ ] Compute partition of weights into disconnected subsets

### Frontend
- [ ] Extend SymmetryBreaker to show irrep decomposition
- [ ] Visual diagram (like Fig 3.14):
  - Color each subset differently
  - Show arrows that get removed
  - Display resulting subalgebra irreps
- [ ] Example: 15 of SU(4) → 3⊕8⊕1⊕3̄ in SU(3)

**Reference Figure:** 3.14 (symmetry breaking in 15 of SU(4))

### Enhanced Multiplet Visualization
- [ ] Show symmetry breaking planes in 2D/3D diagrams
- [ ] Color-code subgroups
- [ ] Animate transition

**Reference Figure:** 3.19 (planes in 3D showing SU(3) subgroups)

---

## Phase 5: Real-Life Application - GUTs (Section 4)

**Interactive Standard Model derivation**

### Backend
- [ ] Preset breaking chains
  - SO(10) → SU(5) → SU(3)⊗SU(2)
  - E₆ → SO(10) → SU(5) → SM
- [ ] Associate fermion names with representations

### Frontend
- [ ] Create `GUTExplorer.tsx` page
- [ ] Step-by-step breaking visualization:
  1. Start with SO(10), show 16 spinor
  2. Break to SU(5): 16 → 10⊕5̄⊕1
  3. Break to SU(3)⊗SU(2): show particle content
  4. Label states (quarks, leptons, neutrinos)
- [ ] Interactive: user clicks nodes to break
- [ ] Show particle table at each stage

**Reference:** Entire Section 4 (Figures 4.1-4.4)

**Output example from dissertation:**
```
16 of SO(10) breaks into:
  - 10 of SU(5)
  - 5̄ of SU(5)  
  - 1 of SU(5)

10 of SU(5) breaks into:
  - 3̄⊗1 + 3⊗2 + 1⊗1 in SU(3)⊗SU(2)
  
(left-handed quarks, right-handed antiquarks, right-handed electron)
```

---

## Phase 6: Additional Library Features (Appendix A Completeness)

**Minor features from PyLA library not yet covered**

### 6.1 Irrep Powers

**Compute R^n (irrep tensored with itself n times)**

#### Backend
- [ ] Implement iterative tensor product: R ⊗ R ⊗ ... ⊗ R
- [ ] Optimize for large n (use previous results)
- [ ] Endpoint: `POST /irreps/power` with `{irrep, n}`

#### Frontend
- [ ] Add power calculator in TensorProductCalc
- [ ] Quick buttons: R², R³, R⁴
- [ ] Display decomposition

**Dissertation reference:** Appendix B benchmarks (27^2 through 27^8 for E₆)

### 6.2 Extended Dynkin Diagram Visualization

**Show extended algebra with γ (highest root)**

#### Backend
- [ ] Compute highest root (γ) for each algebra (Table in dissertation)
- [ ] Generate extended Dynkin diagram data
- [ ] Show which algebras result from crossing each node

#### Frontend  
- [ ] Toggle "Show Extended" on Dynkin diagram
- [ ] Display γ node with special styling
- [ ] Label all nodes (including extension)

**Reference:** Table for extended diagrams (Section 3.5.2)

### 6.3 Search Utilities

#### Backend
- [ ] `findLabelsBetween(dim_min, dim_max, group)`
  - Return all irreps in dimension range
- [ ] `combinator(rank, sum)`
  - Generate all labels with given sum (utility for searches)

#### Frontend
- [ ] Range search in IrrepFinder
- [ ] "Explore up to dimension X" tool

### 6.4 Group Order Calculation

**Rarely used but documented**

- [ ] Backend: Implement `group.order()` 
- [ ] Display in group info card
- [ ] Educational note about finite vs Lie groups

### 6.5 Weight Utilities

#### Backend
- [ ] `limitingWeights(irrep)` - find boundary weights
  - Used internally for diagram rendering
  - Useful for optimization

#### Frontend
- [ ] Highlight limiting weights in multiplet diagrams
- [ ] Use for automatic zoom/framing

---

## Phase 7: Polish & Educational Features

### 7.1 Examples Page Enhancement
- [ ] Add preset calculations from dissertation:
  - 3⊗3 = 6̄⊕3̄ in SU(3)
  - 27⊗27̄ in E₆ (from Appendix B)
  - Powers of representations (27^n through 27^8)
  - 78^n for E₆ (Appendix B)
  - 248^n for E₈ (Appendix B)
- [ ] Show all visualization types for each
- [ ] Performance metrics (compare to benchmarks)

### 7.2 Educational Annotations
- [ ] Tooltips explaining concepts:
  - "What is a Dynkin label?"
  - "Why do we use highest weights?"
  - "What does symmetry breaking mean physically?"
  - "What is the Weyl vector (ρ)?"
  - "What are limiting weights?"
- [ ] Link to relevant dissertation sections
- [ ] Glossary of terms

### 7.3 Export & Sharing
- [ ] Export diagrams as SVG/PNG
- [ ] Generate LaTeX code for results
  - Dynkin diagrams → TikZ code
  - Irrep names → LaTeX symbols
  - Decompositions → formatted equations
- [ ] Shareable URLs with calculation state
- [ ] "Copy Python code" for PyLA library equivalent

### 7.4 Particle Physics Interpretations

**From Section 4**

- [ ] Auto-label particle content for SM groups
  - SU(3): quarks, color charges
  - SU(2): weak isospin doublets
  - Display hypercharge (Y) values
- [ ] Particle table view for GUT breaking:
  - Show which states are quarks vs leptons
  - Left-handed vs right-handed
  - Generation structure
- [ ] Reference Standard Model particle table

---

## Implementation Notes

### Dissertation Code References

Your PyLA library methods (Appendix A) to replicate:

```python
# Group methods
Group.breakSym(node_index)
Group.breakSymExt(node_index)
Group.irrep(dynkin_labels)
Group.dynkinDiagram()

# Irrep methods  
Irrep.weights()
Irrep.links()
Irrep.levels()
Irrep.breakSym(node_index)
Irrep.breakSymExt(node_index)
Irrep.OTimes(other_irrep)

# Utility functions
findLabels(dimension, group)
drawDynkinDiagram(group)
drawDynkinDiagramBrokenSym(group)
drawIrrepDiagram(irrep)
drawIrrepBrokenDiagram(irrep)
drawMultiplet2D(irrep)
drawMultiplet3D(irrep)
```

### Performance Considerations

From your dissertation Appendix B:
- Cache irrep constructions (LRU cache)
- Use C extensions for heavy calculations (like your original library)
- Consider WebWorkers for client-side intensive operations
- Lazy load 3D visualization libraries

### Testing

Use examples from dissertation as test cases:
- All figures in Section 3 are validation cases
- Appendix B benchmark calculations (E₆, E₈ examples)
- Section 4 GUT breaking chains

---

## Timeline Estimate

**Week 1-2:** Phase 1 (Symmetry Breaking) - CRITICAL  
**Week 3-4:** Phase 2 (Visualizations: Hasse, 2D multiplet)  
**Week 5:** Phase 3 (Search, properties)  
**Week 6:** Phase 4 (Irrep breaking visualization)  
**Week 7:** Phase 5 (GUT explorer)  
**Week 8:** Phase 6 (Polish)

**Phases 1-5:** Core features (100% dissertation parity)  
**Phases 6-7:** Polish features (minor library methods + UX enhancements)

Total: **~2-3 months** to achieve complete feature parity with dissertation

---

## ⚠️ What's NOT in the Roadmap

### Explicitly Out of Scope (From Dissertation)

These were mentioned as **future work** in your conclusions (Section 5):

1. **Young Tableaux** ❌
   > "For future versions, one expects to implement tools for working with Young tableaux..."
   - Not implemented in your original PyLA library
   - Would require significant new algorithms
   - Useful for SU(n) representation theory

2. **Clebsch-Gordan Coefficients** ❌
   > "...and calculating Clebsch-Gordan coefficients..."
   - Also listed as future work
   - More detailed than just tensor product decomposition
   - Requires computing explicit matrix elements

3. **Python 3 Migration** ⚠️
   > "...as well as translating the code to Python3 language."
   - Your web app backend IS in Python 3 ✓
   - But we're not porting the original PyLA C extensions
   - Using SymPy instead (different implementation)

### Not Computational Features

4. **Performance Benchmarks vs LieArt** (Appendix B)
   - This is validation/testing, not a feature
   - Could add as documentation/blog post
   - Useful for academic paper, not for end users

5. **Theoretical Background** (Section 2)
   - Educational content, not code
   - Could be added as tutorials/docs
   - Not required for functionality

### Already Decided Against

6. **C Extension Performance**
   - Your original library used Python C-API for speed
   - Web app uses SymPy (pure Python, slower but easier)
   - Trade-off: easier deployment vs raw performance
   - For web use, Python speed is acceptable

---

## ✅ Completeness Summary

After implementing **Phases 1-7**, the web app will have:

| Feature Category | Coverage | Notes |
|-----------------|----------|-------|
| **Core Theory** (Section 2) | 100% | All algorithms implemented |
| **Library Features** (Section 3) | 100% | Every method from Appendix A |
| **GUT Applications** (Section 4) | 100% | SO(10) example fully interactive |
| **Visualizations** | 100% | All diagram types + 3D |
| **Performance** | ~80% | Python vs C trade-off |
| **Future Work** | 0% | Young tableaux, CG coefficients excluded |

**Bottom line:** Yes, you'll be able to reproduce **everything demonstrated in your dissertation** except the C-level performance benchmarks (which aren't features anyway).

The web app will actually ADD capabilities your original library didn't have:
- Interactive UI (no command line needed)
- 3D visualizations (Three.js)
- Shareable calculations (URLs)
- Mobile-friendly
- No installation required

---

## Quick Wins (This Week)

Start with these high-impact, low-effort items:

1. **Symmetry breaking UI** (2-3 days)
   - Add node click handler to existing Dynkin diagram
   - Call breakSymmetry API (implement basic version)
   - Display resulting groups

2. **Find irrep by dimension** (1 day)
   - Simple search form
   - Brute force small dimensions
   - Display table of results

3. **Irrep info card** (1 day)
   - Show dimension, Dynkin labels
   - Conjugate info
   - LaTeX rendering

These will immediately demonstrate capabilities from your dissertation!

---

## 🎁 Bonus: What the Web App ADDS Beyond Your Dissertation

Your original PyLA library was command-line Python. The web app will have new capabilities:

### 1. **Interactive Diagrams**
- Click nodes to break symmetry (not possible in static diagrams)
- Hover for tooltips
- Zoom/pan 3D visualizations
- Real-time updates

### 2. **Zero Installation**
- Original: Required Python + libraries + C compiler
- Web app: Just open in browser
- Mobile/tablet friendly
- Share with colleagues via URL

### 3. **Visual Comparison**
- Side-by-side diagram comparison
- Before/after symmetry breaking
- Multiple tensor products at once

### 4. **Educational Features**
- Step-by-step explanations
- Animated transitions
- Interactive tutorials
- Glossary/help system

### 5. **Modern UX**
- Responsive design
- Dark mode
- Keyboard shortcuts
- Undo/redo
- Calculation history

### 6. **Collaboration**
- Save calculations
- Share results
- Export for papers
- API for programmatic access

### 7. **Extended Examples**
- Complete GUT explorer (interactive Section 4)
- Preset particle physics scenarios
- Educational sandbox mode

So the answer is: **Yes, complete dissertation feature parity + modern web capabilities that make it far more accessible!** 🚀

