import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  date?: string;
  imageUri?: string;
}

const NOTES_STORAGE_KEY = '@notemap_notes';
const TEST_NOTES_GENERATED_KEY = '@notemap_test_notes_generated';

export class NotesService {
  /**
   * Load all notes from storage
   */
  static async loadNotes(): Promise<Note[]> {
    try {
      const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        return JSON.parse(storedNotes);
      }
      return [];
    } catch (error) {
      console.error('Error loading notes:', error);
      throw new Error('Failed to load notes');
    }
  }

  /**
   * Save all notes to storage
   */
  static async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
      throw new Error('Failed to save notes');
    }
  }

  /**
   * Create a new note
   */
  static async createNote(noteData: Omit<Note, 'id'>): Promise<Note> {
    try {
      const newNote: Note = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...noteData,
      };

      const existingNotes = await this.loadNotes();
      const updatedNotes = [...existingNotes, newNote];
      await this.saveNotes(updatedNotes);

      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }
  }

  /**
   * Update an existing note
   */
  static async updateNote(noteId: string, noteData: Partial<Note>): Promise<Note> {
    try {
      const existingNotes = await this.loadNotes();
      const noteIndex = existingNotes.findIndex(n => n.id === noteId);
      
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }

      const updatedNote = { ...existingNotes[noteIndex], ...noteData };
      existingNotes[noteIndex] = updatedNote;
      
      await this.saveNotes(existingNotes);
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note');
    }
  }

  /**
   * Delete a note by ID
   */
  static async deleteNote(noteId: string): Promise<Note | null> {
    try {
      const existingNotes = await this.loadNotes();
      const noteToDelete = existingNotes.find(n => n.id === noteId);
      
      if (!noteToDelete) {
        return null;
      }

      const updatedNotes = existingNotes.filter(n => n.id !== noteId);
      await this.saveNotes(updatedNotes);
      
      return noteToDelete;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note');
    }
  }

  /**
   * Check if test notes have been generated
   */
  static async hasGeneratedTestNotes(): Promise<boolean> {
    try {
      const generated = await AsyncStorage.getItem(TEST_NOTES_GENERATED_KEY);
      return generated === 'true';
    } catch (error) {
      console.error('Error checking test notes flag:', error);
      return false;
    }
  }

  /**
   * Mark test notes as generated
   */
  static async markTestNotesGenerated(): Promise<void> {
    try {
      await AsyncStorage.setItem(TEST_NOTES_GENERATED_KEY, 'true');
    } catch (error) {
      console.error('Error marking test notes as generated:', error);
      throw new Error('Failed to mark test notes as generated');
    }
  }

  /**
   * Generate test notes around a location
   */
  static async generateTestNotes(latitude: number, longitude: number): Promise<Note[]> {
    try {
      const testNotesData = [
        { title: "Coffee Shop", description: "Great coffee and wifi for working", offset: { lat: 0.001, lng: 0.001 } },
        { title: "Park Bench", description: "Nice spot for reading and relaxation", offset: { lat: -0.002, lng: 0.003 } },
        { title: "Restaurant", description: "Amazing pasta and friendly service", offset: { lat: 0.003, lng: -0.001 } },
        { title: "Grocery Store", description: "Don't forget to buy milk and bread", offset: { lat: -0.001, lng: -0.002 } },
        { title: "Gym", description: "Workout schedule: Mon, Wed, Fri", offset: { lat: 0.002, lng: 0.002 } },
        { title: "Library", description: "Quiet study area on second floor", offset: { lat: -0.003, lng: 0.001 } },
        { title: "Bus Stop", description: "Route 42 stops here every 15 minutes", offset: { lat: 0.001, lng: -0.003 } },
        { title: "Pharmacy", description: "Pick up prescription on Tuesday", offset: { lat: -0.002, lng: -0.001 } },
        { title: "ATM", description: "24/7 access, no fees for my bank", offset: { lat: 0.003, lng: 0.003 } },
        { title: "Meetup Spot", description: "Weekly book club meets here Thursday 7pm", offset: { lat: -0.001, lng: 0.002 } }
      ];

      const newTestNotes: Note[] = testNotesData.map((noteData, index) => ({
        id: `test-${Date.now()}-${index}`,
        latitude: latitude + noteData.offset.lat,
        longitude: longitude + noteData.offset.lng,
        title: noteData.title,
        description: noteData.description,
        date: new Date().toLocaleDateString('en-GB'),
      }));

      const existingNotes = await this.loadNotes();
      const updatedNotes = [...existingNotes, ...newTestNotes];
      await this.saveNotes(updatedNotes);
      await this.markTestNotesGenerated();

      return newTestNotes;
    } catch (error) {
      console.error('Error generating test notes:', error);
      throw new Error('Failed to generate test notes');
    }
  }
}
