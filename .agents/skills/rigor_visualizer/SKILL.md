---
name: rigor_visualizer
description: Systematically designs and implements interactive computer animations, SVG/Canvas graphics, and visual tools to make top-tier graduate-level mathematics accessible to a general audience without any simplification of rigor.
---
# Immersive Visualization of Graduate-Level Mathematics

This skill guides the agent in building rich, interactive visualizers, graphics, and computer animations for advanced mathematical concepts (category theory, differential topology, abstract algebra) so they are intuitive to laypeople while preserving complete, top-tier academic rigor.

## Core Visual Design Principles

1. **The Dialectic Bifurcation (Visual Generators vs. Quotient Collapse)**:
   - **Syntax Space (Left side/Input)**: Represent the *unconstrained free generation* process as a dynamic, flowing source of elements (e.g., streaming text tokens, flying vectors, uncreased flat paper coordinates, raw relational databases). Use vibrant, high-energy colors (e.g., active amber, neon blue) and continuous movement.
   - **Semantic Space (Right side/Output)**: Represent the *quotient collapse* as a structured, folded, or grouped shape (e.g., a clustered graph network, a closed torus manifold, a single equivalence class representative, a database pullback/join result). Use grounding, stable colors (e.g., gold, deep emerald, dark slate) and smooth settling animations.
   - **The Functorial Bridge (Middle/Transition)**: Clearly animate the mapping from the generators to the quotient classes. Show the action of the Counit $\varepsilon$ as a "collapsing fold" or "gravitational pull" that groups raw inputs into equivalence classes.

2. **No Placeholders / Absolute Aesthetic Excellence**:
   - Never use placeholder icons, empty boxes, or mock images. All illustrations must be fully drawn using programmatic SVGs or HTML Canvas elements.
   - Use high-fidelity style tokens (e.g., glassmorphism panels, backdrop-filters, subtle glow effects, coordinate grids).
   - Coordinate stability: account for layout shifts by defining fixed aspect-ratio containers with smooth flex/grid responsiveness.

3. **Interactive Micro-Animations**:
   - Hovering over a term in the mathematical equations (e.g., $F(X)$) must highlight the corresponding graphical element in the visualization.
   - Clicking on a step in a computation (e.g., beta-reduction, DFA transition) must trigger a step-by-step trace animation, with elements morphing or sliding along transition paths.
   - Add toggle buttons to let the user switch between different relations (e.g., switching between "no relation", "idempotence", and "commutativity" in the Ontological Cycle).

4. **Rigorous LaTeX Formula Overlays**:
   - Display equations dynamically using KaTeX.
   - Overlay mathematical symbols directly on SVG nodes (e.g., mapping category object nodes with $A$, $B$, or functor arrows with $F$, $U$) using HTML overlays or absolute-positioned text components to link the abstract notation directly to the geometry.

5. **Archaeological/Historical Anchors**:
   - Provide concrete, visual representations of the evolutionary origin of the concept (e.g., render Sumerian clay envelopes containing tokens, interactive Inca quipu threads that knot on click, coordinate warp grids of general relativity space, folding patterns of origami paper).

## Code Implementation Guidelines

1. **SVG & Canvas Coexistence**:
   - Use **SVG** for structural diagrams, category-theoretic commutative diagrams, node-link networks, and crisp typography.
   - Use **HTML5 Canvas** (with requestAnimationFrame loops) for high-performance physics-based animations, continuous field bending (like spacetime gravity wells), particle systems (like unreduced lambda terms), or dense manifolds.
   - Sync their coordinates by matching coordinate frames and using CSS absolute positioning.

2. **React State Integration**:
   - Drive all animations using a reactive state timeline.
   - Provide "Play", "Pause", "Step Forward", "Step Backward", and "Reset" controls for any multi-step reduction or deformation (e.g. homotopy deformation, Myhill-Nerode minimization).
   - Ensure the state binds to speech synthesis so that the animation steps are in lockstep with the audio guide narration.
