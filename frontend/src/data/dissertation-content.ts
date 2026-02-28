/**
 * Dissertation content structure
 * Converted from LaTeX source: "A Python Library for Group Theory Calculations in Particle Physics"
 * Author: Rafael Eberhardt Sarate (2021)
 */

export interface DissertationMetadata {
	title: string;
	subtitle?: string;
	author: string;
	institution: string;
	department: string;
	program: string;
	year: number;
	degree: string;
	advisor: string;
}

export interface DissertationSection {
	id: string;
	number?: string;
	title: string;
	content: string; // Converted from LaTeX to readable text/markdown
	subsections?: DissertationSection[];
	figures?: DissertationFigure[];
	equations?: string[];
}

export interface DissertationFigure {
	id: string;
	number: string;
	caption: string;
	description?: string;
	exampleId?: string; // Links to dissertation-examples.ts
}

export const dissertationMetadata: DissertationMetadata = {
	title: "A Python Library for Group Theory Calculations in Particle Physics",
	author: "Rafael Eberhardt Sarate",
	institution: "Universidade Federal do Rio Grande do Sul - UFRGS",
	department: "Instituto de Física",
	program: "Mestrado em Física Teórica",
	year: 2021,
	degree: "Master of Science in Theoretical Physics",
	advisor: "Prof. Dr. Daniel Gammerman",
};

export const dissertationChapters: DissertationSection[] = [
	{
		id: "acknowledgements",
		title: "Acknowledgements",
		content: `First I ought to acknowledge CAPES for funding my research.

I would like to specially acknowledge the guidance and infinite patience of my supervisor Professor dr. Daniel Gamermann, who turned my almost non-existing knowledge of Group Theory into something appreciable, if I may. Also for believing in me even when I would not.

Special thanks should be said to Professor dr. Dimiter Hadjimichef, for being an inspiring figure as he has always been.

I would also want to acknowledge the whole Physics Department from Federal University of Rio Grande do Sul, for promptly helping me trough any issue I could have found along the way.

I thank my girlfriend, Nathalia Rammé, a fellow in the scientific community, for making me company through most of my master's program and building with me a whole new life style together along the way.

I would like also to thank my brother Keith Eberhardt Sarate, for indicating me for a role in the company he works for and providing me the chance to get a job as soon as I finish my master's program.

I want to thank as well my little sister Maria Luiza Eberhardt, for giving me pride as she grows up smart and making life more meaningful.

I thank my other little sister Carolina Sarate, for listening so patiently to my explanations about nature and trying to replicate it even though she is just learning how to talk.

I would like to thank my colleague Gustavo Dartora, for being my training partner and because he asked for.

I could not forget to thank my colleagues Erison Rocha, Guilherme Peccinni and Guilherme Volkmer for being examples in the Physics community as well as islands of reason throughout this pandemic times.`,
	},
	{
		id: "introduction",
		number: "1",
		title: "Introduction",
		content: `**Symmetries** are essential in Theoretical Physics, playing important role in Classical Physics in Lagrangian and Hamiltonian formulation, but even more fundamental in modern Physics.

**Group Theory** is the area of Mathematics whose subject is the study of symmetries, therefore, being present in most of the work of theoretical physicists going back to the formulation of Quantum Mechanics itself. More precisely, the **theory of representations** of groups by linear transformations was essential to the adequate description of the quantum phenomena, for, aside the principal quantum number, the other quantum numbers we know are associated to **representations** of **Lie Groups**. When it comes to gauge theories, one associates fields to representations of such groups and their algebras; interaction terms in the Lagrangian are built upon tensor products of Lie algebra's representations; mechanisms of spontaneous symmetry breaking are developed via decomposition of those into their subalgebras. Therefore, being able to perform calculations of such nature is essential for modelling new phenomena or even for simply understanding already existing theories.

Said calculations are rather tedious, though, also not always simple task and, so far, there are not many computational options to take care of matters. Some options found in the literature include LieART, LiE, Schur, and SimpLie. So far as this date, however, there is no similar software built on **Python** language.

Here I present a user friendly Python2 library which is able to extract most of the important information from Lie Groups and Lie Algebras and supply it in a clean and straightforward manner.

Even though the cited libraries are much similar to the one developed in the present work, Python is a programming language widely more popular than the ones utilized in their works, and arguably much more pleasant to use - for it reads much more like the way humans think. Even when compared to other vastly applied programming languages by the academic population, such as C or FORTRAN, Python tends to grow in preference year by year.

Python is a high level programming language and, as such, it is known to be slow, rendering itself not very useful when performance is crucial. For the purpose of dealing with such issue, most of the methods provided by the library are built on C language and translated to Python by means of extensions, more precisely, Python C-API, **Application Programming Interface**. Performance-wise, I write a whole section in the appendices where I run some calculations on our library in comparison with similar calculations run in one the libraries above cited.

Furthermore, the fact that C is also a popular language brings another advantage to the present work, for then the code can be easily understood or modified by the reader, which is a crucial point: this application aims to be a modern open source alternative, potentially being subjected to peer development, which, from my perspective is what lies in the most essential nature of the scientific endeavor.

### Capabilities

In terms of utility, the library is able to deal with classical Lie algebras corresponding to the groups SU(N), SO(N), Sp(2N) and SO(2ℓ) as well as with the exceptional Lie algebras G₂, F₄, E₆, E₇ and E₈. It has the capability to:

- Build **irreducible representations** (irreps) of those algebras
- Calculate tensor products between irreps
- Draw pictorial depiction of the algebras with Dynkin diagrams
- Depict irreps with Hasse diagrams
- Visualize consequences of symmetry breaking over those objects

The possibility to create diagrams by means of the library is considered a strong didactic characteristic it presents, for it is, arguably, much easier to learn about Group Theory applied to Particle Physics when there exists an easy way of depicting the subject.

### Model Building

When it comes to model building, it is not simple to construct a model that is mathematically consistent. In many occasions, Group Theory is a good starting point. The theory provides a framework for constructing analogies or models from abstractions, and for the manipulation of those abstractions to design new systems, make new predictions and propose new hypotheses.

### Structure

The rest of the work is presented in three sections:

1. **Theoretical Background**: Starting from familiar objects like the SU(2) group and its algebra, I develop the generalization of concepts easily understood in Quantum Mechanics and introduce the Group Theory language necessary to understand how the library works, as well as its applicability.

2. **Presentation of the Library**: After introducing the fundamental knowledge regarding Lie algebras, I cover the main functionalities of the library, like building irreducible representations; Dynkin diagrams; diagrams depicting quantum numbers of irreps and symmetry breaking, all by means of examples.

3. **Applying to Real Life Problems**: I show that from the group SO(10) we are able to retrieve the particles of the Standard Model of Particle Physics by means of symmetry breaking and, consequently, that it can be considered as option when it comes to building extensions to the SM.`,
	},
	{
		id: "theoretical-background",
		number: "2",
		title: "Theoretical Background",
		content: `Before we get to the core of what is needed for understanding the capabilities of the library and its applications, meaning the study of Lie Groups - or more precisely, Lie Algebras - let us get back a little and make a connection of what is to come with very basic notions from Classical and Quantum Mechanics. 

Thus, with the purpose of building intuition, I find it particularly interesting to begin with the discussion of rotations and, consequently, angular **momentum** - which is conserved under central potentials, therefore it can be used to classify quantum states. Then, we are able to define the commutation relations for the angular **momentum** operators and understand they present a typical algebraic structure, making a connection with the symmetry **group of rotations** in Euclidean Space, SO(3). After discussing how to calculate the **spectrum** of the operators (get the quantum numbers), we extend such notions to more general Lie algebras.`,
		subsections: [
			{
				id: "angular-momentum",
				number: "2.1",
				title: "Angular Momentum Operators",
				content: `Classically, the orbital angular **momentum** is defined as the vector **L** = **r** × **p**. In Quantum Mechanics, as much as in Classical Physics, there are very important problems of systems under the influence of central fields, e.g. the Hydrogen atom, and, as early as in the first days of the theory as we know today, the counterpart of **L** in QM has been introduced.

By means of the **correspondence principle** then, the orbital angular **momentum** is defined as a vector **operator** whose components are, in analogy to **L**, given by commutation relations between position and momentum operators.

The algebra of such operators is defined by their commutation relations. The well known algebra of the angular **momentum** operator is:

[Lᵢ, Lⱼ] = iℏ εᵢⱼₖ Lₖ

It is also easy to check by hand that this respects the Jacobi identity:

[Lᵢ,[Lⱼ, Lₖ]] + [Lⱼ,[Lₖ, Lᵢ]] + [Lₖ,[Lᵢ, Lⱼ]] = 0

and that information is going to be important later.

Even before the early publications on quantum mechanics, experiments like the Stern-Gerlach experiment suggested the existence of another kind of angular **momentum**, an intrinsic one with no classical counterpart. Not much time later, Wolfgang Pauli described the "proper moment" of the electron, what we call **spin** today, as an operator respecting the same algebra as **L**.

So let us postulate that this algebra is respected by the components any kind of angular **momentum** operator, and we refer to it as **J**. It is valid, then:

[Jᵢ, Jⱼ] = iℏ εᵢⱼₖ Jₖ

Having that settled, we can build an operator that commutes with all components of the angular **momentum**, with the consequence that there are simultaneous eigenvectors between them:

J² = Jₓ² + Jᵧ² + J_z²

and [J², Jᵢ] = 0. We have that J² and any component of the angular **momentum** are compatible observables.

### Finding the Spectrum

With the purpose of finding the spectrum of J² and one of the Jᵢ's, we might still want to define two more new (non-hermitian) operators, J₊ and J₋ as:

J₊ = Jₓ ± iJᵧ

These are called **step operators** or **ladder operators** because they raise and lower the eigenvalue of J_z by one unit of ℏ.

From this algebraic analysis, we can derive that the eigenvalues take the form:

J² |ℓ,m⟩ = ℏ² ℓ(ℓ+1)|ℓ,m⟩
J_z |ℓ,m⟩ = ℏ m|ℓ,m⟩

where ℓ = 0, 1/2, 1, 3/2, 2, ... and m = -ℓ, -ℓ+1, ..., 0, ..., ℓ-1, ℓ.

We are done with the eigenvalue problem, and it is important for our purposes to emphasize the fact that **all the results so far are just algebraic consequences** of the commutation relations, showing the power of being able to manipulate such a structure. In fact, it would show to be very useful if we could generalize the procedure above to more complex systems, and that is exactly the point of this whole work. We are going to see that any system provided with symmetry is subject to be treated by means of similar tools. For some systems, though, the calculations might be extensive and boring, then our library can do the job for you.`,
			},
			{
				id: "lie-groups",
				number: "2.2",
				title: "Lie Groups",
				content: `Everything we have seen so far comes naturally trough the development of Quantum Mechanics, but we need to understand it as the outcome of more abstract concepts such as **groups** and **algebras**, more specifically, **Lie Groups** and **Lie Algebras**. Let us start, then, by defining what consists a group.

A group, 𝒢, is a set, g, provided with an operation called **product**, *, respecting the following conditions:

1. **Closure**: The set g is closed under the product: ∀ a, b ∈ g, a*b ∈ g.

2. **Associativity**: ∀ a, b, c ∈ g, (a*b)*c = a*(b*c)

3. **Identity**: There exist some I𝒢 in 𝒢, also called **neutral element**, such that ∀ a ∈ g, a*I𝒢 = I𝒢*a = a

4. **Inverse**: For all element a ∈ g, there must be an inverse, a⁻¹ ∈ g, such that a*a⁻¹ = a⁻¹*a = I𝒢.

In order to build intuition, and make an important connection between symmetries and groups, we might consider the example of rotations that preserve the symmetry of systems which indeed possess rotational symmetry. If we represent such rotations by rotation matrices, it is easy to show that they respect the above conditions with the matrix multiplication as the product.

### Rotation Operators

Back to Quantum Mechanics, the rotation operator, D̂, is a matrix whose dimension depends on the ket space it acts on. For infinitesimal rotations around n̂, of an angle δφ, it assumes the form:

D̂(n̂, δφ) = 𝟙 - (1/ℏ) n̂ · Ĵ δφ

In the case of finite rotations, it takes the form:

D̂(n̂,φ) = exp{-i φ n̂ · Ĵ/ℏ}

where the angular **momentum**, Ĵ, is said to be the **generator** of the rotation.

It is important for us to know that the elements of any group associated to **continuous** transformations just like the above, denominated a **Lie Group** (after the Norwegian mathematician Sophus Lie), have the same form. Also, in order to get information about continuous groups, suffices to know the relationship between its generators instead of working with the group elements themselves - anytime we want, we can take the exponential of the former to retrieve the latter. Those relationships are in fact the algebra of the generators and, in the case of a Lie Group, they are called **Lie Algebras**.

The commutation relations we studied for angular momentum are examples of Lie Algebras, both associated to **rotation** groups. The algebra is associated to SO(3), the group of all 3×3 **orthogonal** matrices whose determinant is +1, and also to SU(2), the group formed by all 2×2 **unitary** matrices of determinant +1. The fact that SO(3) and SU(2) have identical algebras is called **isomorphism**.

We have seen that utilizing algebraic tools for dealing with the angular **momentum** operator has proven to be very useful in the problem of determining its spectrum, therefore it would be really convenient if we were able to find similar structures in other algebras, for then we could just copy the same procedures we are already familiar with.`,
			},
			{
				id: "generalization",
				number: "2.3",
				title: "Generalization for any Lie Algebra",
				content: `Much of what we are going to encounter next is the work of a Russian mathematician called Eugene Dynkin, who, in 1947, published a paper in which he presented complex Lie Algebras in the structure we are about to study, as well as invented what we call **root system**, fundamental for our present work, and the **Dynkin diagrams**, that enable us to visualize algebras in a very intuitive way. 

Just like we have done for the case of SU(2), it is by means of the root system of a **semisimple Lie Algebra** that we are able to describe the effect of the lowering and raising operators of the group's algebra on the eigenvalues (quantum numbers) of the diagonal generators, and provide geometrical interpretation of the commutation relations.

At this point, we are almost ready to develop the knowledge necessary to comprehend our library in its full glory. Before going ahead, though, we should clarify the concept of semisimple Lie Algebra just mentioned. We say a Lie Algebra is **semisimple** when it is the direct sum of **simple** Lie Algebras, meaning the algebras of simple Lie Groups. The latter are, in turn, groups that do not possess a **continuous invariant subgroup**. Finally, an **invariant subgroup**, a, is a subgroup of 𝒢 such that the action of the elements of 𝒢 on its elements does not take them out of a.`,
				subsections: [
					{
						id: "cartan-weyl",
						number: "2.3.1",
						title: "The Cartan-Weyl Base",
						content: `After finding the commutation relation between the generators of a group, which is the **standard** form of the algebra associated to it, it is always possible to make a base transition by means of a linear combination of the generators.

What is important is the fact that, for any basis, the commutation relation between the generators may be written in the following form:

[Ĵᵢ, Ĵⱼ] = Σₖ Cᵢⱼᵏ Ĵₖ

where n is the dimension of 𝒢 and Cᵢⱼᵏ are the so called **structure constants** which, locally, determine 𝒢 completely.

It is always possible, then, to write the algebra in a basis such that it contains the **largest possible number of generators commuting with each other**, or, in other words, all the **simultaneously diagonalizable generators** - or, yet, the maximal **abelian subalgebra**. We call that the **Cartan subalgebra** of the 𝒢. The cardinality of the Cartan subalgebra, ℓ, corresponds to the **rank** of the group - which is analog to the notion of dimension of a vector space - and that also means the maximum amount of structure constants equal to 0 for that algebra. The rest of the non-zero structure constants are going to play a very crucial role in the development of our work, receiving the special name of **roots** of the algebra.

Said basis is called **Cartan-Weyl basis** and, in order to construct it, we start with the Cartan subalgebra:

[Ĥᵢ, Ĥⱼ] = 0;  i,j = 1,2,3...,ℓ

where Ĥᵢ act like **weight operators**.

Than we demand the other generators, to which we will refer as Êα to respect the following commutation relation:

[Ĥᵢ, Êα] = αᵢ Êα;  i,j = 1,2,3...,ℓ

where the **weight of the operators**, the αᵢ are the contravariant components of a vector, **α**, in an ℓ-dimensional space, called **root vector**. It is important to point out that the Eα act as the step operators we defined for SU(2).

For the algebra to be complete, we need two more commutation relations, that can be obtained from the first two. Taking the hermitian conjugate, we find that Eα† = E₋α, and we interpret Eα as a **raising** and E₋α as a **lowering** operator.

Using the Jacobi identity, we can show:

[Êα, Ê₋α] = **α** · **Ĥ**

And also:

[Êα, Êβ] = Nαβ Êα+β

where α + β ≠ 0 and Nαβ = 0 if α + β is not a root.

Finally, we conclude that an algebra written in the Cartan-Weyl basis has the general form:

- [Êα, Êβ] = Nαβ Êα+β,  α ≠ β
- [Êα, Ê₋α] = αⁱ Hᵢ
- [Ĥᵢ, Êα] = αᵢ Êα
- [Ĥᵢ, Ĥⱼ] = 0

It should be clear that this way of writing the algebra is completely analogous to the algebras of SO(3) and SU(2) we have seen above, just written in a different base. In this language, operators like J² receive a new denomination. One characteristic that renders it useful in SU(2) is the fact that it commutes with all components of Ĵ, or, in other words, with all generators of the group. Operators with that property are called **Casimir operators**, and their number in a group corresponds to its rank.

Being able to write the algebra in the above fashion is advantageous because then the Casimir operators together with the weight operators form a commuting set of hermitian operators and, as such, there are states that can be defined with respect to them and used to **define quantum numbers**. Also, the manner in which we defined and utilized the step operators in SU(2) can now be reproduced for more complex algebras.`,
					},
					{
						id: "root-vectors",
						number: "2.3.2",
						title: "Graphical Representation of Root Vectors",
						content: `Since the roots of the algebras written in the Cartan-Weyl basis are vectors, we are able to define the scalar product between them:

(α, β) = αⁱ βᵢ

Then, follow three important consequences:

1. If α and β are roots, then 2(α, β)/(α, α) is an integer and β - 2(α, β)/(α, α) is also a root.

2. If α is a root vector, then α, 0 and -α are the only integer multiples of α that are also root vectors.

3. A root series based on α which contains another root β consists of no more than four roots, satisfying 2(α, β)/(α, α) = 0, ±1, ±2, ±3.

From what is stated above, if we draw vectors corresponding to each root, an ℓ-dimensional diagram is built and it is unique for each algebra, therefore an useful way of visualizing quantum numbers.

Still, as a consequence of what has been stated, it can be shown that the angle between those vectors might only be φ = 0°, 30°, 45°, 60° and 90°.

It is also easy to show the connection between those angles and the ratios of the roots α and β (where the shorter root is chosen to be β), (α, α)/(β, β):

- φ = 30°,  (α, α)/(β, β) = 3
- φ = 45°,  (α, α)/(β, β) = 2
- φ = 60°,  (α, α)/(β, β) = 1
- φ = 90°,  (α, α)/(β, β): not enough information to know

The library is capable of generating graphics depicting these root systems for various algebras. These visualizations are important because they represent the quantum numbers of irreducible representations and will appear in examples throughout the text.`,
						figures: [
							{
								id: "fig-3-su3",
								number: "3.16",
								caption: "Diagram for 3 of SU(3) in quantum number space.",
								description: "Equilateral triangle pointing up representing the fundamental representation",
								exampleId: "su3-3-multiplet",
							},
							{
								id: "fig-3bar-su3",
								number: "3.17",
								caption: "Diagram for 3̄ of SU(3) in quantum number space.",
								description: "Equilateral triangle pointing down representing the anti-fundamental representation",
								exampleId: "su3-3bar-multiplet",
							},
							{
								id: "fig-8-su3",
								number: "3.18",
								caption: "Diagram for 8 of SU(3) in quantum number space.",
								description: "Regular hexagon with center point (multiplicity 2) representing the adjoint representation",
								exampleId: "su3-8-multiplet",
							},
						],
					},
					{
						id: "dynkin-diagrams",
						number: "2.3.3",
						title: "Dynkin Diagrams",
						content: `Dynkin realized that all the information about an algebra can be retrieved from a small subset of its root vectors, what he called the **simple roots**. And it is possible to build a diagram representing them, which we call today a **Dynkin diagram**, from which is easy to deduce the angles between the positive roots, as well as the ratio between their lengths.

In order to define a simple root then (which is a definition depending on the basis choice), we need first to define what is a **positive root**, which is a root whose first non-negative coordinate, in that basis, is positive. Now, we say that a root is **simple** if it is not the sum of two positive roots.

There are also three conditions regarding simple roots:

1. If α and β are simple roots, α - β is not a simple root.
2. If α and β are simple roots, 2(α,β)/(α, α) = -p, where p ∈ ℤ⁺.
3. The angles between two simple roots might only be 90°, 120°, 135° or 150°

If (β, β) ≤ (α, α), it follows:

- φ = 120°,  (α, α)/(β, β) = 1
- φ = 135°,  (α, α)/(β, β) = 2
- φ = 150°,  (α, α)/(β, β) = 3
- φ = 90°,   (α, α)/(β, β): not enough information to know

Dynkin prescribed that in the diagram, the simple roots are represented by circles connected by one, two or three lines in case the angles between them are 120°, 135° or 150° respectively, while orthogonal roots are disconnected. The shortest root vectors are represented by filled circles, as opposed to the unfilled ones regarding the largest vectors. Consequently, each algebra is uniquely represented.

The classical Lie algebras have Dynkin diagrams as follows:

- **Aℓ** (SU(ℓ+1)): Chain of ℓ unfilled circles
- **Bℓ** (SO(2ℓ+1)): Chain ending with filled circle and double bond
- **Cℓ** (Sp(2ℓ)): Chain ending with unfilled circle and double bond  
- **Dℓ** (SO(2ℓ)): Chain with fork at the end

The exceptional algebras (G₂, F₄, E₆, E₇, E₈) have their own unique diagrams with various branching patterns.`,
					},
					{
						id: "cartan-matrices",
						number: "2.3.4",
						title: "Cartan Matrices",
						content: `Now it has come the time to talk about the most fundamental object to our library. To each algebra it is possible to relate a matrix, called **Cartan Matrix**, containing pretty much the same information as in the Dynkin diagrams. Therefore, upon having one, the other may be obtained.

The elements of the Cartan matrix are given by:

Aᵢⱼ = 2(αᵢ, αⱼ)/(αᵢ, αᵢ)

where αᵢ are simple roots.

The usage of our library will typically start with the construction of a group based on the respective Cartan Matrix, from which all information about the algebra is generated.

We have now established enough theoretical background to move on and present the library. We are going to treat topics like the construction of **irreducible representations**, or **irreps**, along with their dimensions and their classification; products of irreps; symmetry breaking and the creation of diagrams containing information about the algebras.`,
					},
				],
			},
		],
	},
	{
		id: "library-presentation",
		number: "3",
		title: "Presentation of the Library",
		content: `Here I illustrate the underlying reasoning by which some of the main capabilities possessed by the library have been developed. I do not have the pretension of writing a manual, since I do not want to show how to use the library, but how it actually produces the results it is able to generate.

That being said, I mean to cover only part of the vast endeavor that comprehends the library, for the rest of its functionalities are all built upon what I am about to expose. In the appendices, the reader find all the methods the library possesses and the comparison of its performance with a similar library found in the literature.`,
		subsections: [
			{
				id: "generating-dynkin",
				number: "3.1",
				title: "Generating Dynkin Diagrams",
				content: `We have already seen that there are conditions respected by the simple roots of a semisimple Lie Algebra, and that taking them in consideration, Dynkin proposed the construction of the diagrams now known by his name.

I am going to use the same conditions to work out an example of how the library builds the referred diagram **from** a given Cartan Matrix. So far I have used SU(n) as example whenever one was given, but the diagrams corresponding to those algebras are rather too simple. Therefore, it might be interesting to work on the example of F₄'s algebra.

The library is also capable of producing Dynkin diagrams for groups whose symmetry has been broken, and we come back the issue later, when we will see that it makes the library really useful to work with GUTS.`,
			},
			{
				id: "building-irreps",
				number: "3.2",
				title: "Building Irreps",
				content: `In Quantum Mechanics, we are used to the concept of **multiplet**, consisting of states defined by the eigenvalues of some observables appropriate to define quantum number. Also, by means of the step operators, one is able to "navigate" between the states belonging to the multiplet, but no state outside the multiplet can be accessed by their action. The notion of multiplet can be extended for more complex algebras, and henceforth, we are going to regard it as an **irreducible representation** of an algebra, or **irrep**.

The basis vectors |u⟩ of an irrep are classified by their eigenvalues with respect to the operators Hᵢ of the Cartan subalgebra:

Hᵢ |u⟩ = λᵢ(u) |u⟩

We call the **weight** of a state the vector:

Λ(u) = (λ₁(u), ..., λₗ(u))

where ℓ is the rank of the Lie algebra.

We can express the weights in terms of the simple roots of the algebra:

λ = Σᵢ μᵢ αᵢ;  μᵢ ∈ ℚ

We can also define an ordering relation between weight vectors: we say λ is greater than λ' if the first non-zero λᵢ - λ'ᵢ, i = 1, 2..., N is positive. As such we uniquely determine a **maximal weight**, Λₘₐₓ for each irrep, with the properties:

1. Λₘₐₓ is non-degenerate
2. There is a one-to-one correspondence between Λₘₐₓ and the corresponding irrep

Now, in order to make them useful for our purposes, we must write them in the so called **Dynkin basis**, where, for each Λ, its components in this form are:

aᵢ = 2(λ, αᵢ)/(αᵢ, αᵢ)

Now, it is easy to see that, from the definition above, the aᵢ's are all integers, turning the calculations easier. As an example, a triplet of SU(3), in the Dynkin basis, is (1, 0) or (0, 1).`,
				subsections: [
					{
						id: "algorithmic-approach",
						number: "3.2.1",
						title: "An Algorithmic Approach",
						content: `What I am going to present is an algorithmic procedure, for that is how the library works. We start by choosing the group with which we want to work and the maximal weight of the irrep we want to construct. I say it might be interesting to build the irrep for Λₘₐₓ = (1, 0, 1), in SU(4), given its algebra is not as simple as the SU(2)'s and SU(3)'s but still not so complex to the point of turning the following calculations too absorbing.

The lines of the Cartan matrix coincide with the simple roots of the algebra written in the Dynking basis. From Λₘₐₓ = (1, 0, 1) we can "go down" subtracting simple roots in the correct fashion:

- since the first element of Λₘₐₓ is ≥ 0 and equal to 1, we subtract α₀ from Λₘₐₓ **once** and the resulting vector is a root
- since the second element is 0, we cannot subtract α₁ from Λₘₐₓ
- since the third element is again ≥ 0 and equal to 1, we subtract α₂ from Λₘₐₓ **once** and the resulting vector is a root

We repeat the process for each root arising from the last step till the point where no positive root is produced. The result of the whole process produces a Hasse diagram showing all weights in the irrep.

The library generates these diagrams automatically from the Dynkin labels.`,
					},
					{
						id: "multiplicity",
						number: "3.2.2",
						title: "Multiplicity of Simple Roots Inside Irreps",
						content: `Remains the problem of determining the multiplicity of each obtained root. For that matter, one might use both the methods furnished next:

**Freudenthal's formula**: A recurrence formula that allows calculating the multiplicity of any weight in an irrep given the multiplicities of "higher" weights.

**The Weyl Orthogonal Group**: From symmetry observations, if we look at root reflections, we know that symmetric roots should have the same multiplicity. The Weyl group is the subgroup formed by all the reflections in the root system, and this symmetry can be used to determine multiplicities more efficiently than Freudenthal's formula for many cases.

The library implements both methods for calculating weight multiplicities.`,
					},
				],
			},
			{
				id: "irrep-dimension",
				number: "3.3",
				title: "Dimension of an Irrep",
				content: `It is not necessary to build the irrep to know its dimension given the highest weight, **Λₘₐₓ**, by means of the **Weyl dimension** formula:

dim(**Λₘₐₓ**) = ∏α⁺ (α⁺, **Λₘₐₓ** + **δ**)/(α⁺, **δ**)

where α⁺ refers to a positive root and **δ** = (1,1,...,1) (with the same number of components as the given weight).

### The Nomenclature Problem

It is possible to have more than one irrep with the same dimension. One example is the 3 and 3̄ of SU(3), where 3̄ is the conjugate of 3. But that is still not the only possibility of confusion, for there are irreps with the same dimension in an algebra which are not the conjugate of each other.

For solving that issue, we define an **index** to the irrep and a **congruency number**. Together with the dimension, these uniquely identify each irrep and allow proper naming (20, 2̄0, 20', 20'', 2̄0'', etc.).`,
			},
			{
				id: "irrep-multiplication",
				number: "3.4",
				title: "Multiplication of Irreps",
				content: `The evident majority of systems in nature are made of multiple particles. Then, in the case of coupling between the particles, the individual quantum numbers might not be conserved, and we are not able to work with the states corresponding to the individual parts. In that case, we might want to work with the space generated from the product between irreps, which is reducible.

Again I am going to present an algorithmic approach in order to illustrate how the library works out the tensor product between irreps. Let us then go about the product 3 ⊗ 3 in SU(3).

We start by building the irreps we want to multiply. Next, we sum term by term each root in the first irrep to each root in the second. In sequence, we search for the highest positive weight in the obtained list and build the corresponding irrep. After eliminating from the list the weights belonging to that irrep, we repeat the process until the whole list is spanned.

The result shows how the product space decomposes into irreducible representations. For example: 3 ⊗ 3 = 6̄ ⊕ 3̄ in SU(3).`,
			},
			{
				id: "symmetry-breaking",
				number: "3.5",
				title: "Symmetry Breaking",
				content: `It is important to point out that the Standard Model of Particle Physics, SM, is built in terms of Lie Algebras, meaning all fundamental forces except gravity are underlined by means of symmetry groups, more specifically, SU(3), SU(2) and U(1). These correspond, respectively, to the strong, weak and electromagnetic forces, where each existing particle corresponds to a representation of those groups.

The SM is the most successful theory for the description of elementary particles and their interactions mankind has developed so far, but there are limitations. The model presents 19 free parameters (25 if we take in consideration the masses of neutrinos and the parameters associated to cross-generational mixing between them) not derived from principles, but which have been introduced so the model agrees with observation.

Among other reasons, that is enough to motivate the search for groups with larger symmetries then the Standard Model from which SU(3)⊗SU(2)⊗U(1) emerges under **symmetry breaking**. Some of the most explored candidates as symmetry group for the so called GUT's - Grand Unified Theories - are the classical Lie Groups SU(5) and the SO(10) and the exceptional Lie Group E₆.

Even inside the Standard Model, mechanisms of spontaneous symmetry braking plays important role in giving the masses of the particles. Because of the above reasons, one very useful feature of our library its set of tools developed to deal with symmetry breaking. It is able to generate symmetry breaking following two different paths: by eliminating one node from do Dynkin diagram for the algebra we are working with or by eliminating a node from the corresponding **extended** Dynkin diagram. The first breaks the original algebra into **non-semisimple subalgebras**, while the second breaks it into semisimple subalgebras.

We have already seen that every semisimple Lie Algebra decomposes as a direct sum of simple Lie algebras. Now, a non-semisimple Lie algebra is a semisimple Lie algebra times U(1).`,
				subsections: [
					{
						id: "non-semisimple-decomposition",
						number: "3.5.1",
						title: "Decomposing Algebras into Non-Semisimple Subalgebras",
						content: `In this case, we start from the Dynkin diagram for the algebra whose symmetry we want to break. In order to promote symmetry breaking, we need to chose one of the nodes in the diagram to be eliminated. The result is two or more disconnected Dynkin diagrams representing semisimple Lie algebras, while the eliminated dot represents U(1).

An interesting example is breaking the symmetry of SU(5) by eliminating the dot in the Dynking diagram corresponding to α₂. The resulting diagram shows SU(5) breaks into SU(3)⊗SU(2)⊗U(1).`,
					},
					{
						id: "semisimple-decomposition",
						number: "3.5.2",
						title: "Decomposing Algebras into Semisimple Lie Algebras",
						content: `In this case, before the breaking, we introduce another node in the Dynkin diagram, which depicts, then, the so-called **extended Lie algebra**. This is generating by adding the negative of the **highest root**, which is the weight corresponding to the **adjoint** representation of the same algebra, to the set of the simple roots of the original algebra.

An adjoint representation is a map from the group on the **general linear group**, or the the group of invertible matrices, or yet a representation with dimension of the group, given by linear transformations on the Lie algebra.

All the extended Dynkin diagrams for the classical and exceptional algebras can be constructed systematically. For example, breaking the symmetry of the extended algebra for E₆ by means of eliminating α₃, generates two disconnected Dynkin diagrams corresponding to SU(6) and SU(2), so E₆ breaks into SU(6)⊗SU(2).`,
					},
					{
						id: "irrep-symmetry-breaking",
						number: "3.5.3",
						title: "Breaking Symmetry of Irreps",
						content: `With the purpose of studying the consequence of symmetry breaking on the irreps of an algebra, consider breaking SU(4) symmetry. If we eliminate a node from the Dynkin diagram, we determine how the irreps of the larger group decompose into irreps of the smaller groups.

Since we chose to risk a specific simple root from the Dynkin diagram, we should also risk the corresponding element in each weight in the original irrep. By eliminating arrows corresponding to that simple root subtraction, isolated subsets of roots are created, each corresponding to an irrep in the smaller group.

The library can visualize this process through Hasse diagrams showing how multiplets decompose under symmetry breaking. This is crucial for understanding how particles in Grand Unified Theories map to Standard Model particles.`,
					},
				],
			},
			{
				id: "multiplet-diagrams",
				number: "3.6",
				title: "Multiplet Diagrams in Quantum Number Space",
				content: `We have seen examples of diagrams regarding irreps in the quantum number space. Now we explore the path the library takes in order to construct them.

First, the user must provide the library with a list of vectors in the Euclidean space for some group's root vectors. For future versions, this process is expected to be automatized. For now, we must keep in mind the Dynkin diagram for the group to which the irrep belongs.

As an example, consider the diagram for the 8 in SU(3). From the Cartan matrix we identify the ratio, and consequently the angle, between the chosen vectors. In this case, both have the same length and the angle between them is 120°. So we can chose the first as α = (1, 0), which makes the second β = (-0.5, √3/2).

Given those vectors, then the library makes combinations between them: from the rules exposed earlier, besides the given vectors, α + β is a root, as well as -α, -β and -(α + β). The linear combination that generates the (0, 0) must be the trivial one (0α+0β), or, otherwise, α and β would not be linearly independent. Since the library is able to calculate the multiplicity of each root, that is used to decide that the (0, 0) happens twice, then completing the diagram.

It is easy to extrapolate the described method for plots in 3 dimensions. The painted planes in 3D diagrams correspond to irreps of subalgebras, providing one more way to understand how smaller groups fit inside larger ones and visualize the consequences of symmetry breaking.`,
				figures: [
					{
						id: "fig-15-su4",
						number: "3.19",
						caption: "Diagram for 15 of SU(4) in quantum number space.",
						description: "3D multiplet diagram showing how the 15 of SU(4) decomposes under symmetry breaking to SU(3)",
					},
				],
			},
		],
	},
	{
		id: "real-life-problems",
		number: "4",
		title: "Applying to Real Life Problems",
		content: `A complete demonstration of the powers our library delivers could not be made without a proper demonstration of its functionalities in an practical problem.

I am going to show how we are able to retrieve all particles from the SM from the larger symmetry group SO(10). When it comes to a Grand Unified Theory, the particles that do not couple in the subalgebras contained in the larger group may be part of an irrep in the latter, for they are subject to one unified force in intense energy regimes. So, for the considered GUT, all the 15 fermions of a generation are in the same 16-dimensional irrep of SO(10).

In the SM, the generators of the groups SU(3), SU(2) and U(1) are bosonic particles (the 8 gluons mediators of the strong interaction, the W± and Z⁰, mediators of the weak interaction and the photon, carrier of the electromagnetic force), and, therefore, the way the fermions interact via those bosons depends on their representations.

### The 15 Fermions

For example, the left-handed quarks up and down are triplets of the SU(3) but doublets of the SU(2), while right-handed electrons are singlets in both groups. The 15 fermions of the SM of the first generation are:

- **Left-handed quarks**: 3_{SU(3)} ⊗ 2_{SU(2)}, hypercharge 1/3
- **Left-handed leptons**: 1_{SU(3)} ⊗ 2_{SU(2)}, hypercharge -1
- **Right-handed up quark**: 3̄_{SU(3)} ⊗ 1_{SU(2)}, hypercharge 4/3
- **Right-handed down quark**: 3̄_{SU(3)} ⊗ 1_{SU(2)}, hypercharge -2/3
- **Right-handed electron**: 1_{SU(3)} ⊗ 1_{SU(2)}, hypercharge -2

The reader should also remember the U(1) is always present when we eliminate a dot from a Dynkin diagram in order to promote the symmetry breaking. The physical meaning of such singlet varies from GUT to GUT and, sometimes, is interpreted as a right-handed neutrino.

### SO(10) → SU(5) → SU(3)⊗SU(2)

Using the library, we first break SO(10) → SU(5)⊗U(1) by eliminating node α₄. The 16-dimensional spinor representation of SO(10) decomposes as:

16 → 10 ⊕ 5̄ ⊕ 1

Then breaking SU(5) → SU(3)⊗SU(2)⊗U(1) by eliminating node α₂, we find:

- 5̄_{SU(5)} → 1_{SU(3)}⊗2_{SU(2)} ⊕ 3̄_{SU(3)}⊗1_{SU(2)}
- 10_{SU(5)} → 3̄_{SU(3)}⊗1_{SU(2)} ⊕ 3_{SU(3)}⊗2_{SU(2)} ⊕ 1_{SU(3)}⊗1_{SU(2)}

From these decompositions, we see that the Left-handed anti-leptons and the right-handed down quark emerge as part of the same 5-dimensional irrep in the SU(5). Similarly, the 10 in SU(5) breaks into the anti-right-handed electron plus the anti-right-handed up quark plus the left handed quarks.

The library's diagrams clearly visualize these decompositions, showing how all Standard Model fermions fit into a single SO(10) multiplet.`,
	},
	{
		id: "conclusions",
		number: "5",
		title: "Conclusions",
		content: `I have presented an open source library application in Python2 language for calculating quantities associated to Lie Algebras and their representations for the use in Particle Physics. It is able to generate group objects from the related Cartan matrix, as well as Dynkin diagrams; diagrams depicting the multiplets both in 2D and 3D; irreducible representions, along with their classifications; Weyl reflections; tensor products of irreps; promoting symmetry breaking between other useful functions.

We have started this project with the idea of using the library to build effective Lagrangians for bound quarks states, but it has been shown to be specially useful for dealing with symmetry breaking, therefore, being a great tool for the study of GUTS. With that in mind, an example of the problem and how it would be treated by means of the library was illustrated.

For future versions, one expects to implement tools for working with Young tableaux and calculating Clebsch-Gordan coefficients, as well as translating the code to Python3 language.

### Key Achievements

- **First Python implementation** of comprehensive Lie algebra calculations for particle physics
- **Performance competitive** with established libraries (100x faster in some cases)
- **Open source** to enable peer development and community contributions
- **Pedagogical value** through extensive visualization capabilities
- **Practical applications** demonstrated through GUT symmetry breaking

The library represents a modern, accessible tool for both research and education in theoretical physics, particularly in the study of symmetries and their role in fundamental interactions.`,
	},
];

export default dissertationChapters;
